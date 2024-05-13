import {
  Approval,
  ApprovalForAll,
  Collect,
  DecreaseLiquidity,
  IncreaseLiquidity,
  Transfer,
} from '../generated/NFTPositionsManager/NFTPositionsManager';
import { NFT } from '../generated/schema';
import { ethereum, crypto,store,BigInt } from '@graphprotocol/graph-ts';

export function handleIncreaseLiquidity(event: IncreaseLiquidity): void {
  let entity = NFT.load(event.params.tokenId.toHex());
  if(entity != null){
    entity.liquidity = event.params.liquidity;
    entity.token0Amount = entity.token0Amount.plus(event.params.amount0);
    entity.token1Amount = entity.token1Amount.plus(event.params.amount1);
    entity.save();
  }
}

export function handleDecreaseLiquidity(event: DecreaseLiquidity): void {
  let entity = NFT.load(event.params.tokenId.toHex());
  if (entity != null) {
    entity.liquidity = event.params.liquidity;
    entity.token0Amount = entity.token0Amount.minus(event.params.amount0);
    entity.token1Amount = entity.token1Amount.minus(event.params.amount1);
    entity.save();
  }
}

export function handleTransfer(event: Transfer): void {
  let entity = NFT.load(event.params.tokenId.toHex());
  if (entity != null) {
    entity.owner = event.params.to;
    entity.save();
  }else{
    entity = new NFT(event.params.tokenId.toHex());
    entity.tokenId = event.params.tokenId
    entity.owner = event.params.to;
    entity.token0Amount = BigInt.fromI32(0);
    entity.token1Amount = BigInt.fromI32(0);
    entity.save();
  }
}

