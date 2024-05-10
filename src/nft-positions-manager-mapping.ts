import {
  Approval,
  ApprovalForAll,
  Collect,
  DecreaseLiquidity,
  IncreaseLiquidity,
  Transfer,
} from '../generated/NFTPositionsManager/NFTPositionsManager';
import { NFT } from '../generated/schema';
import { ethereum, crypto,store } from '@graphprotocol/graph-ts';

export function handleIncreaseLiquidity(event: IncreaseLiquidity): void {
  let entity = Position.load(event.params.tokenId.toHex());
  if (entity == null) {
    entity = new Position(event.params.tokenId.toHex());
    entity.approved = null;
    entity.tokenId = event.params.tokenId;
    entity.owner = event.transaction.from;
    entity.staked = false;
    entity.oldOwner = null;
  }
  entity.liquidity = event.params.liquidity;
  entity.save();
}

export function handleDecreaseLiquidity(event: DecreaseLiquidity): void {
  let entity = Position.load(event.params.tokenId.toHex());
  if (entity != null) {
    entity.liquidity = event.params.liquidity;
    entity.save();
  }
}

export function handleTransfer(event: Transfer): void {
  let entity = NFT.load(event.params.tokenId.toHex());
  if (entity != null) {
    entity.
    entity.owner = event.params.to;
    entity.save();
  }else{
    entity = new NFT(event.params.tokenId.toHex());
    entity.tokenId = event.params.tokenId
    entity.owner = event.params.to;
    entity.save();
  }

}

