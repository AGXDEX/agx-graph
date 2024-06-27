import { ethereum, crypto,store,BigInt } from '@graphprotocol/graph-ts';
import {
    ClaimReward
} from '../generated/YieldEmission/YieldEmission';
import {Incentive, TotalReward, Position, SwapInfo, ClaimHistory} from '../generated/schema';


export function handleClaim(event: ClaimReward): void {
    let entity = new ClaimHistory(event.transaction.hash)
    entity.owner = event.params.receiver;
    entity.amount = event.params.amount;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash
    entity.type = BigInt.fromI32(2);
    entity.save();
}

