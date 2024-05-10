import { ethereum, crypto,store } from '@graphprotocol/graph-ts';
import {
  DepositTransferred,
  RewardClaimed,
  TokenStaked,
  TokenUnstaked,
} from '../generated/UniV3Staker/UniV3Staker';
import {  Position } from '../generated/schema';




export function handleTokenStaked(event: TokenStaked): void {
  let entity = Position.load(event.params.tokenId.toHex());
  if (entity != null) {
    entity.staked = true;
    entity.liquidity = event.params.liquidity;
    entity.incentiveId = event.params.incentiveId;
    entity.save();
  }
}

export function handleTokenUnstaked(event: TokenUnstaked): void {
  let entity = Position.load(event.params.tokenId.toHex());
  if (entity != null) {
    entity.staked = false;
    entity.incentiveId = null;
    entity.save();
  }
}

export function handleDepositTransferred(event: DepositTransferred): void {
  let entity = Position.load(event.params.tokenId.toHex());
  if (entity == null) {
    entity = new Position(event.params.tokenId.toHex());
    entity.tokenId = event.params.tokenId;
    entity.owner = event.params.newOwner;
    entity.staked = false;
    entity.save();
  }else {
    store.remove("Position", event.params.tokenId.toHex());
  }
}
