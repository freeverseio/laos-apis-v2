import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_, StringColumn as StringColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {PolygonOwnershipContract} from "./polygonOwnershipContract.model"
import {PolygonTransfer} from "./polygonTransfer.model"

@Entity_()
export class PolygonAsset {
    constructor(props?: Partial<PolygonAsset>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => PolygonOwnershipContract, {nullable: true})
    ownershipContract!: PolygonOwnershipContract

    @IntColumn_({nullable: false})
    chainId!: number

    @BigIntColumn_({nullable: false})
    tokenId!: bigint

    @StringColumn_({nullable: false})
    owner!: string

    @OneToMany_(() => PolygonTransfer, e => e.asset)
    transfers!: PolygonTransfer[]
}
