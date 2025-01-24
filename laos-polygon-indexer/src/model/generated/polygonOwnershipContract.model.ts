import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, IntColumn as IntColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {PolygonAsset} from "./polygonAsset.model"

@Entity_()
export class PolygonOwnershipContract {
    constructor(props?: Partial<PolygonOwnershipContract>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @StringColumn_({nullable: true})
    address!: string | undefined | null

    @IntColumn_({nullable: false})
    chainId!: number

    @Index_()
    @StringColumn_({nullable: true})
    laosContract!: string | undefined | null

    @StringColumn_({nullable: true})
    name!: string | undefined | null

    @StringColumn_({nullable: true})
    symbol!: string | undefined | null

    @StringColumn_({nullable: true})
    bytecodeHash!: string | undefined | null

    @OneToMany_(() => PolygonAsset, e => e.ownershipContract)
    assets!: PolygonAsset[]
}
