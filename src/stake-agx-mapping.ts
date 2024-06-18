import { ethereum, crypto,store,BigInt } from '@graphprotocol/graph-ts';
import {
    Staked,
    UnStake,
    ClaimReward,
} from '../generated/StakeAGX/StakeAGX';
import {Incentive, TotalReward, Position, SwapInfo, ClaimHistory, StakeAGX, StakeAGXReward} from '../generated/schema';


export function handleStaked(event: Staked): void {
    let entity = new StakeAGX(event.params.id.toHex());
    entity.owner = event.params.receiver;
    entity.amount = event.params.amount;
    entity.period = event.params.period;
    entity.startTime = event.block.timestamp;
    entity.save();
}

export function handleUnStake(event: UnStake): void {
    store.remove("StakeAGX", event.params.id.toHex());
}

export function handleClaim(event: ClaimReward): void {
    let entity = new ClaimHistory(event.transaction.hash)
    entity.owner = event.params.receiver;
    entity.amount = event.params.amount;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash
    entity.type = BigInt.fromI32(3);
    entity.save();


    let totalReward = StakeAGXReward.load(event.params.receiver.toHex());
    if(totalReward == null) {
        totalReward = new StakeAGXReward(event.params.receiver.toHex())
        totalReward.owner = event.params.receiver;
        totalReward.reward = event.params.amount
    }else{
        totalReward.reward = totalReward.reward.plus(event.params.amount);
    }
    totalReward.save();
}
