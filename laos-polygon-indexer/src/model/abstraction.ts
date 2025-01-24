import { PolygonAsset } from "./generated/polygonAsset.model";
import { PolygonOwnershipContract } from "./generated/polygonOwnershipContract.model";

export class Asset extends PolygonAsset {
  constructor(props?: Partial<Asset>) {
    super(props);
    Object.assign(this, props);
  }
}

export class OwnershipContract extends PolygonOwnershipContract {
  constructor(props?: Partial<OwnershipContract>) {
    super(props);
    Object.assign(this, props);
  }
}