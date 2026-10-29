import { describe, expect, it } from "vitest";
import { normalizeGolfCourse, type Coordinate, type SourceKey } from "./normalize";
import { scoreTargetRisks } from "./riskScore";
import { createProjection, EARTH_RADIUS_M, holeCoordinates } from "./map";
import type { OverpassElement, SourceMetadata } from "./overpass";

const p = (x:number,y:number):Coordinate=>({lat:y/EARTH_RADIUS_M*180/Math.PI,lon:x/EARTH_RADIUS_M*180/Math.PI});
const box=(x0:number,y0:number,x1:number,y1:number)=>[p(x0,y0),p(x1,y0),p(x1,y1),p(x0,y1),p(x0,y0)];
const water=(id:number,geometry:Coordinate[]):OverpassElement=>({type:"way",id,tags:{golf:"water_hazard",ref:"1"},geometry});
const relation=(geometry:Coordinate[],interior?:Coordinate[]):OverpassElement=>({type:"relation",id:20,tags:{type:"multipolygon",golf:"water_hazard",ref:"1"},members:[
  {type:"way",ref:21,role:"outer",geometry},
  ...(interior?[{type:"way",ref:22,role:"inner",geometry:interior}]:[]),
]});
const source:SourceMetadata={query:"synthetic",endpoint:"https://example.invalid",completedAt:"2026-10-29T00:00:00Z",bbox:"0,0,0.01,0.01",copyrightUrl:"https://www.openstreetmap.org/copyright"};
function result(features:OverpassElement[]) {
  const normalized=normalizeGolfCourse({elements:[
    {type:"way",id:1,tags:{leisure:"golf_course"},geometry:box(-100,-200,500,300)},
    {type:"way",id:2,tags:{golf:"hole",ref:"1"},geometry:[p(0,0),p(300,0)]},
    ...features,
  ]},source,"way/1");
  const hole=normalized.holes[0];
  const projection=createProjection(holeCoordinates(hole));
  if("kind" in projection)throw new Error(projection.kind);
  const targets=[{...p(0,0),id:"t-000000000000",label:"Origin"},{...p(300,0),id:"t-000000000001",label:"Landing"}];
  const scores=scoreTargetRisks({hole,projection,targets,origin:{kind:"target",targetId:targets[0].id},club:{id:"p-000000000000",label:"Synthetic",carry:100,longitudinal:80,lateral:40}});
  return {normalized,hole,score:scores.candidates[1]};
}

describe("normalization to water-risk review regressions",()=>{
  it("keeps independently tagged inner water because the parent excludes its occupied area",()=>{
    const interior=box(30,-60,150,60);
    const parent=relation(box(-10,-100,200,100),interior);
    const without=result([parent]);
    expect(without.score).toMatchObject({penalty:0,sampleCount:512});
    const withInner=result([parent,water(22,interior)]);
    expect(withInner.hole.features.map(f=>f.source.sourceKey)).toContain("way/22");
    expect(withInner.normalized.warnings.some(w=>w.code==="DISTINCT_MEMBER_FEATURE"&&w.sourceKey==="way/22")).toBe(true);
    expect(withInner.score).toMatchObject({penalty:100,overlapSamples:512});
  });

  it.each(["relation","way"] as const)("withholds comparison on conflicting applicable %s water even with valid water elsewhere",type=>{
    const first=type==="relation"?relation(box(-10,-100,200,100)):water(20,box(-10,-100,200,100));
    const second=type==="relation"?relation(box(-20,-90,210,90)):water(20,box(-20,-90,210,90));
    const other=water(30,box(250,100,270,120));
    for(const input of [[first,second,other],[other,second,first]]) {
      const r=result(input);
      expect(r.normalized.warnings.some(w=>w.code==="DUPLICATE_SOURCE_KEY"&&w.sourceKey===`${type}/20` as SourceKey)).toBe(true);
      expect(r.hole.riskGeometryUnavailable).toBe(true);
      expect(r.score).toMatchObject({status:"unavailable",penalty:null,warnings:expect.arrayContaining(["irregular-risk-polygon"])});
    }
  });
});
