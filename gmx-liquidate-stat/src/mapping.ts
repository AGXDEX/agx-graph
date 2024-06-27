import { BigInt, Address, Bytes, TypedMap, ethereum, store, log } from "@graphprotocol/graph-ts"

import {
  IncreasePosition as IncreasePositionEvent,
  DecreasePosition as DecreasePositionEvent,
  LiquidatePosition as LiquidatePositionEvent,
  UpdatePosition as UpdatePositionEvent, ClosePosition
} from "../generated/Vault/Vault";

import {

  ActivePosition,
   PositionKey
} from "../generated/schema";

import { 
  DecreaseUsdgAmount,
  IncreaseUsdgAmount,
  DecreaseReservedAmount,
  IncreaseReservedAmount
} from "../generated/Vault/Vault"

let ZERO = BigInt.fromI32(0)
let FUNDING_PRECISION = BigInt.fromI32(1000000)

const LIQUIDATOR_ADDRESS = "0x44311c91008dde73de521cd25136fd37d616802c"

export function handleIncreasePosition(event: IncreasePositionEvent): void {

  _storePositionKey(event.params.key.toHexString(), event.params.account.toHexString(), event.params.indexToken.toHexString(), event.params.isLong,   event.params.collateralToken.toHexString());
}

export function handleDecreasePosition(event: DecreasePositionEvent): void {
  _storePositionKey(event.params.key.toHexString(), event.params.account.toHexString(), event.params.indexToken.toHexString(), event.params.isLong,   event.params.collateralToken.toHexString());
}
export function handleClosePosition(event: ClosePosition): void {
  store.remove("ActivePosition", event.params.key.toHexString());
  }


export function handleUpdatePosition(event: UpdatePositionEvent): void {
  let activePosition = ActivePosition.load(event.params.key.toHexString());
  if(activePosition == null){
    activePosition = new ActivePosition(event.params.key.toHexString());
  }
  activePosition.averagePrice = event.params.averagePrice
  activePosition.entryFundingRate = event.params.entryFundingRate
  activePosition.collateral = event.params.collateral
  activePosition.size = event.params.size
  activePosition.positionInfo = event.params.key.toHexString();
  activePosition.leverage = event.params.size.div(event.params.collateral);
  activePosition.save()
}

export function handleLiquidatePosition(event: LiquidatePositionEvent): void {

  // liquidated collateral is not a fee. it's just traders pnl
  // also size * rate incorrect as well because it doesn't consider borrow fee
  store.remove("ActivePosition", event.params.key.toHexString());

}




function _storePositionKey(key: string, account: string, token: string, isLong: boolean, collateralToken: string): void {
  let positionKey = PositionKey.load(key);
  if (positionKey === null) {
      positionKey = new PositionKey(key);
      positionKey.isLong = isLong;
      positionKey.account = account;
      positionKey.indexToken = token;
      positionKey.collateralToken = collateralToken;
      positionKey.save();
  }
}

