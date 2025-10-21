/**
 * Monadgotchi Contract ABI
 */
export const MONADGOTCHI_ABI = [
  // mint function
  {
    inputs: [],
    name: 'mint',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // feed function
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'petId',
        type: 'uint256',
      },
    ],
    name: 'feed',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // getCurrentHunger function
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'petId',
        type: 'uint256',
      },
    ],
    name: 'getCurrentHunger',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  // getPetStatus function
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'petId',
        type: 'uint256',
      },
    ],
    name: 'getPetStatus',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'hunger',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'lastFeedBlock',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'isFainted',
            type: 'bool',
          },
        ],
        internalType: 'struct Monadgotchi.Pet',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  // grantDelegation function
  {
    inputs: [
      {
        internalType: 'address',
        name: 'delegate',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'petId',
        type: 'uint256',
      },
    ],
    name: 'grantDelegation',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // revokeDelegation function
  {
    inputs: [
      {
        internalType: 'address',
        name: 'delegate',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'petId',
        type: 'uint256',
      },
    ],
    name: 'revokeDelegation',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // delegations mapping (public getter)
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'delegations',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  // balanceOf function (ERC721)
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  // Events
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'petId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    name: 'PetMinted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'petId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'feeder',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    name: 'PetFed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'petId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newHungerLevel',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    name: 'PetHungerUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'petId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    name: 'PetFainted',
    type: 'event',
  },
] as const;
