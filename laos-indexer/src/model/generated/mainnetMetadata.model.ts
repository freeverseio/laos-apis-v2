import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_} from "@subsquid/typeorm-store"
import {MainnetLaosAsset} from "./mainnetLaosAsset.model"
import {MainnetTokenUri} from "./mainnetTokenUri.model"

@Entity_()
export class MainnetMetadata {
    constructor(props?: Partial<MainnetMetadata>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => MainnetLaosAsset, {nullable: true})
    laosAsset!: MainnetLaosAsset

    @Index_()
    @ManyToOne_(() => MainnetTokenUri, {nullable: true})
    tokenUri!: MainnetTokenUri

    @IntColumn_({nullable: false})
    blockNumber!: number

    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @Index_()
    @StringColumn_({nullable: false})
    txHash!: string
}
