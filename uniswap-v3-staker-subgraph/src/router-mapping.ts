import { ethereum, crypto,store } from '@graphprotocol/graph-ts';
import {
    Swap
} from '../generated/Router/Router';
import {  SwapInfo } from '../generated/schema';




export function handleSwap(event: Swap): void {
    let entity = new SwapInfo(event.transaction.hash)
    entity.owner = event.params.account;
    entity.tokenIn = event.params.tokenIn;
    entity.tokenOut = event.params.tokenOut;
    entity.amountIn = event.params.amountIn;
    entity.amountOut = event.params.amountOut;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash
    entity.save();
}
