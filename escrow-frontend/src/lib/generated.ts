import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Escrow
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const escrowAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'admin',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_seller', internalType: 'address payable', type: 'address' },
    ],
    name: 'createEscrow',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'escrowCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'escrows',
    outputs: [
      { name: 'buyer', internalType: 'address payable', type: 'address' },
      { name: 'seller', internalType: 'address payable', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'status', internalType: 'enum Escrow.Status', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_escrowId', internalType: 'uint256', type: 'uint256' }],
    name: 'fundEscrow',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_escrowId', internalType: 'uint256', type: 'uint256' }],
    name: 'openDispute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_escrowId', internalType: 'uint256', type: 'uint256' }],
    name: 'releaseFunds',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_escrowId', internalType: 'uint256', type: 'uint256' }],
    name: 'renderService',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_escrowId', internalType: 'uint256', type: 'uint256' },
      { name: '_winner', internalType: 'address payable', type: 'address' },
    ],
    name: 'settleDispute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'escrowId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'EscrowCompleted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'escrowId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'buyer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'seller',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'EscrowCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'escrowId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'EscrowDisputed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'escrowId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'EscrowFunded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'escrowId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'winner',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'EscrowSettled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'escrowId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'ServiceRendered',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link escrowAbi}__
 */
export const useReadEscrow = /*#__PURE__*/ createUseReadContract({
  abi: escrowAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link escrowAbi}__ and `functionName` set to `"admin"`
 */
export const useReadEscrowAdmin = /*#__PURE__*/ createUseReadContract({
  abi: escrowAbi,
  functionName: 'admin',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link escrowAbi}__ and `functionName` set to `"escrowCount"`
 */
export const useReadEscrowEscrowCount = /*#__PURE__*/ createUseReadContract({
  abi: escrowAbi,
  functionName: 'escrowCount',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link escrowAbi}__ and `functionName` set to `"escrows"`
 */
export const useReadEscrowEscrows = /*#__PURE__*/ createUseReadContract({
  abi: escrowAbi,
  functionName: 'escrows',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link escrowAbi}__
 */
export const useWriteEscrow = /*#__PURE__*/ createUseWriteContract({
  abi: escrowAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link escrowAbi}__ and `functionName` set to `"createEscrow"`
 */
export const useWriteEscrowCreateEscrow = /*#__PURE__*/ createUseWriteContract({
  abi: escrowAbi,
  functionName: 'createEscrow',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link escrowAbi}__ and `functionName` set to `"fundEscrow"`
 */
export const useWriteEscrowFundEscrow = /*#__PURE__*/ createUseWriteContract({
  abi: escrowAbi,
  functionName: 'fundEscrow',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link escrowAbi}__ and `functionName` set to `"openDispute"`
 */
export const useWriteEscrowOpenDispute = /*#__PURE__*/ createUseWriteContract({
  abi: escrowAbi,
  functionName: 'openDispute',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link escrowAbi}__ and `functionName` set to `"releaseFunds"`
 */
export const useWriteEscrowReleaseFunds = /*#__PURE__*/ createUseWriteContract({
  abi: escrowAbi,
  functionName: 'releaseFunds',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link escrowAbi}__ and `functionName` set to `"renderService"`
 */
export const useWriteEscrowRenderService = /*#__PURE__*/ createUseWriteContract(
  { abi: escrowAbi, functionName: 'renderService' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link escrowAbi}__ and `functionName` set to `"settleDispute"`
 */
export const useWriteEscrowSettleDispute = /*#__PURE__*/ createUseWriteContract(
  { abi: escrowAbi, functionName: 'settleDispute' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link escrowAbi}__
 */
export const useSimulateEscrow = /*#__PURE__*/ createUseSimulateContract({
  abi: escrowAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link escrowAbi}__ and `functionName` set to `"createEscrow"`
 */
export const useSimulateEscrowCreateEscrow =
  /*#__PURE__*/ createUseSimulateContract({
    abi: escrowAbi,
    functionName: 'createEscrow',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link escrowAbi}__ and `functionName` set to `"fundEscrow"`
 */
export const useSimulateEscrowFundEscrow =
  /*#__PURE__*/ createUseSimulateContract({
    abi: escrowAbi,
    functionName: 'fundEscrow',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link escrowAbi}__ and `functionName` set to `"openDispute"`
 */
export const useSimulateEscrowOpenDispute =
  /*#__PURE__*/ createUseSimulateContract({
    abi: escrowAbi,
    functionName: 'openDispute',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link escrowAbi}__ and `functionName` set to `"releaseFunds"`
 */
export const useSimulateEscrowReleaseFunds =
  /*#__PURE__*/ createUseSimulateContract({
    abi: escrowAbi,
    functionName: 'releaseFunds',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link escrowAbi}__ and `functionName` set to `"renderService"`
 */
export const useSimulateEscrowRenderService =
  /*#__PURE__*/ createUseSimulateContract({
    abi: escrowAbi,
    functionName: 'renderService',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link escrowAbi}__ and `functionName` set to `"settleDispute"`
 */
export const useSimulateEscrowSettleDispute =
  /*#__PURE__*/ createUseSimulateContract({
    abi: escrowAbi,
    functionName: 'settleDispute',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link escrowAbi}__
 */
export const useWatchEscrowEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: escrowAbi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link escrowAbi}__ and `eventName` set to `"EscrowCompleted"`
 */
export const useWatchEscrowEscrowCompletedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: escrowAbi,
    eventName: 'EscrowCompleted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link escrowAbi}__ and `eventName` set to `"EscrowCreated"`
 */
export const useWatchEscrowEscrowCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: escrowAbi,
    eventName: 'EscrowCreated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link escrowAbi}__ and `eventName` set to `"EscrowDisputed"`
 */
export const useWatchEscrowEscrowDisputedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: escrowAbi,
    eventName: 'EscrowDisputed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link escrowAbi}__ and `eventName` set to `"EscrowFunded"`
 */
export const useWatchEscrowEscrowFundedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: escrowAbi,
    eventName: 'EscrowFunded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link escrowAbi}__ and `eventName` set to `"EscrowSettled"`
 */
export const useWatchEscrowEscrowSettledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: escrowAbi,
    eventName: 'EscrowSettled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link escrowAbi}__ and `eventName` set to `"ServiceRendered"`
 */
export const useWatchEscrowServiceRenderedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: escrowAbi,
    eventName: 'ServiceRendered',
  })
