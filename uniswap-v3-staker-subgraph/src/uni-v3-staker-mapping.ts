import { ethereum, crypto,store,BigInt } from '@graphprotocol/graph-ts';
import {
  DepositTransferred, IncentiveCreated,
  RewardClaimed, RewardClaimed__Params,
  TokenStaked,
  TokenUnstaked,
} from '../generated/UniV3Staker/UniV3Staker';
import {Incentive, TotalReward, Position, SwapInfo, ClaimHistory} from '../generated/schema';

export function handleRewardClaimed(event: RewardClaimed): void {
  let incentive = Incentive.load(BigInt.fromI32(1).toHex());
  if (incentive == null) {
    incentive = new Incentive(BigInt.fromI32(1).toHex());
    incentive.liquidity = BigInt.fromI32(0);
    incentive.claimedToken = BigInt.fromI32(0);
  }
  incentive.claimedToken = incentive.claimedToken.plus(event.params.reward);
  incentive.save();


  let totalReward = TotalReward.load(event.params.to.toHex());
  if(totalReward == null) {
    totalReward = new TotalReward(event.params.to.toHex())
    totalReward.owner = event.params.to;
    totalReward.reward = event.params.reward
  }else{
    totalReward.reward = totalReward.reward.plus(event.params.reward);
  }
  totalReward.save();

  let entity = new ClaimHistory(event.transaction.hash)
  entity.owner = event.params.to;
  entity.amount = event.params.reward;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash
  entity.type = BigInt.fromI32(1);
  entity.save();



}
export function handleTokenStaked(event: TokenStaked): void {
  let entity = Position.load(event.params.tokenId.toHex());
  let incentive = Incentive.load(BigInt.fromI32(1).toHex());
  if (incentive == null) {
    incentive = new Incentive(BigInt.fromI32(1).toHex());
    incentive.liquidity = BigInt.fromI32(0);
    incentive.claimedToken = BigInt.fromI32(0);

  }
  if (entity != null) {
    entity.staked = true;
    entity.liquidity = event.params.liquidity;
    entity.incentiveId = event.params.incentiveId;
    entity.save();
    incentive.liquidity =  incentive.liquidity.plus(entity.liquidity);
    incentive.save();

  }
}

export function handleTokenUnstaked(event: TokenUnstaked): void {
  let entity = Position.load(event.params.tokenId.toHex());
  let incentive = Incentive.load(BigInt.fromI32(1).toHex());
  if (incentive == null) {
    incentive = new Incentive(BigInt.fromI32(1).toHex());
    incentive.liquidity = BigInt.fromI32(0);
    incentive.claimedToken = BigInt.fromI32(0);

  }
  if (entity != null) {
    entity.staked = false;
    incentive.liquidity = incentive.liquidity.minus(entity.liquidity);

    entity.liquidity = BigInt.fromI32(0);
    entity.incentiveId = null;
    entity.save();
    incentive.save();
  }

}

export function handleDepositTransferred(event: DepositTransferred): void {
  let incentive = Incentive.load(BigInt.fromI32(1).toHex());
  if (incentive == null) {
    incentive = new Incentive(BigInt.fromI32(1).toHex());
    incentive.liquidity = BigInt.fromI32(0);
    incentive.claimedToken = BigInt.fromI32(0);
    incentive.save();
  }
  let entity = Position.load(event.params.tokenId.toHex());
  if (entity == null) {
    entity = new Position(event.params.tokenId.toHex());
    entity.tokenId = event.params.tokenId;
    entity.owner = event.params.newOwner;
    entity.staked = false;
    entity.liquidity = BigInt.fromI32(0);
    entity.save();
  }else {
    store.remove("Position", event.params.tokenId.toHex());
  }
}

