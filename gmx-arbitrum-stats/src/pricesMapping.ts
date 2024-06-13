import { BigInt, Address } from "@graphprotocol/graph-ts"

import {
  ChainlinkPrice,
  FastPrice,
  UniswapPrice
} from "../generated/schema"

import {
  WETH,
  BTC,
  LINK,
  UNI,
  MIM,
  SPELL,
  SUSHI,
  DAI,
  GMX,
  getTokenAmountUsd,
  timestampToPeriod
} from "./helpers"

import {
  SetPrice
} from '../generated/FastPriceFeed/FastPriceFeed'

import {
  PriceUpdate
} from '../generated/FastPriceEvents/FastPriceEvents'


function _storeChainlinkPrice(token: string, value: BigInt, timestamp: BigInt, blockNumber: BigInt): void {
  let id = token + ":" + timestamp.toString()
  let entity = new ChainlinkPrice(id)
  entity.value = value
  entity.period = "any"
  entity.token = token
  entity.timestamp = timestamp.toI32()
  entity.blockNumber = blockNumber.toI32()
  entity.save()

  let totalId = token
  let totalEntity = new ChainlinkPrice(token)
  totalEntity.value = value
  totalEntity.period = "last"
  totalEntity.token = token
  totalEntity.timestamp = timestamp.toI32()
  totalEntity.blockNumber = blockNumber.toI32()
  totalEntity.save()
}
function _storeUniswapPrice(
  id: string,
  token: string,
  price: BigInt,
  period: string,
  timestamp: BigInt,
  blockNumber: BigInt
): void {
  let entity = UniswapPrice.load(id)
  if (entity == null) {
    entity = new UniswapPrice(id)
  }

  entity.timestamp = timestamp.toI32()
  entity.blockNumber = blockNumber.toI32()
  entity.value = price
  entity.token = token
  entity.period = period
  entity.save()
}



function _handleFastPriceUpdate(token: Address, price: BigInt, timestamp: BigInt, blockNumber: BigInt): void {
  let dailyTimestampGroup = timestampToPeriod(timestamp, "daily")
  _storeFastPrice(dailyTimestampGroup.toString() + ":daily:" + token.toHexString(), token, price, dailyTimestampGroup, blockNumber, "daily")

  let hourlyTimestampGroup = timestampToPeriod(timestamp, "hourly")
  _storeFastPrice(hourlyTimestampGroup.toString() + ":hourly:" + token.toHexString(), token, price, hourlyTimestampGroup, blockNumber, "hourly")

  _storeFastPrice(timestamp.toString() + ":any:" + token.toHexString(), token, price, timestamp, blockNumber, "any")
  _storeFastPrice(token.toHexString(), token, price, timestamp, blockNumber, "last")
}

function _storeFastPrice(
  id: string,
  token: Address,
  price: BigInt,
  timestampGroup: BigInt,
  blockNumber: BigInt,
  period: string,
): void {
  let entity = new FastPrice(id)
  entity.period = period
  entity.value = price
  entity.token = token.toHexString()
  entity.timestamp = timestampGroup.toI32()
  entity.blockNumber = blockNumber.toI32()
  entity.save()
}

export function handlePriceUpdate(event: PriceUpdate): void {
  _handleFastPriceUpdate(event.params.token, event.params.price, event.block.timestamp, event.block.number)
}

export function handleSetPrice(event: SetPrice): void {
  _handleFastPriceUpdate(event.params.token, event.params.price, event.block.timestamp, event.block.number)
}
