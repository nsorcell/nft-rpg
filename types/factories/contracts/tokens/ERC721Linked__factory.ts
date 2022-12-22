/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  ERC721Linked,
  ERC721LinkedInterface,
} from "../../../contracts/tokens/ERC721Linked";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162002aad38038062002aad8339818101604052810190620000379190620001fa565b818181600090816200004a9190620004ca565b5080600190816200005c9190620004ca565b5050505050620005b1565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620000d08262000085565b810181811067ffffffffffffffff82111715620000f257620000f162000096565b5b80604052505050565b60006200010762000067565b9050620001158282620000c5565b919050565b600067ffffffffffffffff82111562000138576200013762000096565b5b620001438262000085565b9050602081019050919050565b60005b838110156200017057808201518184015260208101905062000153565b60008484015250505050565b6000620001936200018d846200011a565b620000fb565b905082815260208101848484011115620001b257620001b162000080565b5b620001bf84828562000150565b509392505050565b600082601f830112620001df57620001de6200007b565b5b8151620001f18482602086016200017c565b91505092915050565b6000806040838503121562000214576200021362000071565b5b600083015167ffffffffffffffff81111562000235576200023462000076565b5b6200024385828601620001c7565b925050602083015167ffffffffffffffff81111562000267576200026662000076565b5b6200027585828601620001c7565b9150509250929050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680620002d257607f821691505b602082108103620002e857620002e76200028a565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620003527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8262000313565b6200035e868362000313565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b6000620003ab620003a56200039f8462000376565b62000380565b62000376565b9050919050565b6000819050919050565b620003c7836200038a565b620003df620003d682620003b2565b84845462000320565b825550505050565b600090565b620003f6620003e7565b62000403818484620003bc565b505050565b5b818110156200042b576200041f600082620003ec565b60018101905062000409565b5050565b601f8211156200047a576200044481620002ee565b6200044f8462000303565b810160208510156200045f578190505b620004776200046e8562000303565b83018262000408565b50505b505050565b600082821c905092915050565b60006200049f600019846008026200047f565b1980831691505092915050565b6000620004ba83836200048c565b9150826002028217905092915050565b620004d5826200027f565b67ffffffffffffffff811115620004f157620004f062000096565b5b620004fd8254620002b9565b6200050a8282856200042f565b600060209050601f8311600181146200054257600084156200052d578287015190505b620005398582620004ac565b865550620005a9565b601f1984166200055286620002ee565b60005b828110156200057c5784890151825560018201915060208501945060208101905062000555565b868310156200059c578489015162000598601f8916826200048c565b8355505b6001600288020188555050505b505050505050565b6124ec80620005c16000396000f3fe608060405234801561001057600080fd5b50600436106100cf5760003560e01c80636352211e1161008c578063a22cb46511610066578063a22cb46514610224578063b88d4fde14610240578063c87b56dd1461025c578063e985e9c51461028c576100cf565b80636352211e146101a657806370a08231146101d657806395d89b4114610206576100cf565b806301ffc9a7146100d457806306fdde0314610104578063081812fc14610122578063095ea7b31461015257806323b872dd1461016e57806342842e0e1461018a575b600080fd5b6100ee60048036038101906100e99190611754565b6102bc565b6040516100fb919061179c565b60405180910390f35b61010c61039e565b6040516101199190611847565b60405180910390f35b61013c6004803603810190610137919061189f565b610430565b604051610149919061190d565b60405180910390f35b61016c60048036038101906101679190611954565b610476565b005b61018860048036038101906101839190611994565b61058d565b005b6101a4600480360381019061019f9190611994565b6105ed565b005b6101c060048036038101906101bb919061189f565b61060d565b6040516101cd919061190d565b60405180910390f35b6101f060048036038101906101eb91906119e7565b61074d565b6040516101fd9190611a23565b60405180910390f35b61020e610804565b60405161021b9190611847565b60405180910390f35b61023e60048036038101906102399190611a6a565b610896565b005b61025a60048036038101906102559190611bdf565b6108ac565b005b6102766004803603810190610271919061189f565b61090e565b6040516102839190611847565b60405180910390f35b6102a660048036038101906102a19190611c62565b610976565b6040516102b3919061179c565b60405180910390f35b60007f80ac58cd000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916148061038757507f5b5e139f000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b80610397575061039682610a0a565b5b9050919050565b6060600080546103ad90611cd1565b80601f01602080910402602001604051908101604052809291908181526020018280546103d990611cd1565b80156104265780601f106103fb57610100808354040283529160200191610426565b820191906000526020600020905b81548152906001019060200180831161040957829003601f168201915b5050505050905090565b600061043b82610a74565b6004600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b600061048182610abf565b90508073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036104f1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104e890611d74565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff16610510610b45565b73ffffffffffffffffffffffffffffffffffffffff16148061053f575061053e81610539610b45565b610976565b5b61057e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161057590611e06565b60405180910390fd5b6105888383610b4d565b505050565b61059e610598610b45565b82610c06565b6105dd576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105d490611e98565b60405180910390fd5b6105e8838383610c9b565b505050565b610608838383604051806020016040528060008152506108ac565b505050565b60008060066000848152602001908152602001600020805461062e90611cd1565b80601f016020809104026020016040519081016040528092919081815260200182805461065a90611cd1565b80156106a75780601f1061067c576101008083540402835291602001916106a7565b820191906000526020600020905b81548152906001019060200180831161068a57829003601f168201915b50505050509050600080828060200190518101906106c59190611f0b565b915091508173ffffffffffffffffffffffffffffffffffffffff16636352211e826040518263ffffffff1660e01b81526004016107029190611a23565b602060405180830381865afa15801561071f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107439190611f60565b9350505050919050565b60008073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036107bd576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107b490611fff565b60405180910390fd5b600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b60606001805461081390611cd1565b80601f016020809104026020016040519081016040528092919081815260200182805461083f90611cd1565b801561088c5780601f106108615761010080835404028352916020019161088c565b820191906000526020600020905b81548152906001019060200180831161086f57829003601f168201915b5050505050905090565b6108a86108a1610b45565b8383610f94565b5050565b6108bd6108b7610b45565b83610c06565b6108fc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108f390611e98565b60405180910390fd5b61090884848484611100565b50505050565b606061091982610a74565b600061092361115c565b90506000815111610943576040518060200160405280600081525061096e565b8061094d84611173565b60405160200161095e92919061205b565b6040516020818303038152906040525b915050919050565b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b610a7d81611241565b610abc576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ab3906120cb565b60405180910390fd5b50565b600080610acb83611282565b9050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610b3c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b33906120cb565b60405180910390fd5b80915050919050565b600033905090565b816004600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff16610bc083610abf565b73ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b600080610c1283610abf565b90508073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161480610c545750610c538185610976565b5b80610c9257508373ffffffffffffffffffffffffffffffffffffffff16610c7a84610430565b73ffffffffffffffffffffffffffffffffffffffff16145b91505092915050565b8273ffffffffffffffffffffffffffffffffffffffff16610cbb82610abf565b73ffffffffffffffffffffffffffffffffffffffff1614610d11576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d089061215d565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610d80576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d77906121ef565b60405180910390fd5b610d8d83838360016112bf565b8273ffffffffffffffffffffffffffffffffffffffff16610dad82610abf565b73ffffffffffffffffffffffffffffffffffffffff1614610e03576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610dfa9061215d565b60405180910390fd5b6004600082815260200190815260200160002060006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556001600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055506001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4610f8f83838360016113e5565b505050565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603611002576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ff99061225b565b60405180910390fd5b80600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31836040516110f3919061179c565b60405180910390a3505050565b61110b848484610c9b565b611117848484846113eb565b611156576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161114d906122ed565b60405180910390fd5b50505050565b606060405180602001604052806000815250905090565b60606000600161118284611572565b01905060008167ffffffffffffffff8111156111a1576111a0611ab4565b5b6040519080825280601f01601f1916602001820160405280156111d35781602001600182028036833780820191505090505b509050600082602001820190505b600115611236578080600190039150507f3031323334353637383961626364656600000000000000000000000000000000600a86061a8153600a858161122a5761122961230d565b5b049450600085036111e1575b819350505050919050565b60008073ffffffffffffffffffffffffffffffffffffffff1661126383611282565b73ffffffffffffffffffffffffffffffffffffffff1614159050919050565b60006002600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b60018111156113df57600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff16146113535780600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461134b919061236b565b925050819055505b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16146113de5780600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546113d6919061239f565b925050819055505b5b50505050565b50505050565b600061140c8473ffffffffffffffffffffffffffffffffffffffff166116c5565b15611565578373ffffffffffffffffffffffffffffffffffffffff1663150b7a02611435610b45565b8786866040518563ffffffff1660e01b81526004016114579493929190612428565b6020604051808303816000875af192505050801561149357506040513d601f19601f820116820180604052508101906114909190612489565b60015b611515573d80600081146114c3576040519150601f19603f3d011682016040523d82523d6000602084013e6114c8565b606091505b50600081510361150d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611504906122ed565b60405180910390fd5b805181602001fd5b63150b7a0260e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161491505061156a565b600190505b949350505050565b600080600090507a184f03e93ff9f4daa797ed6e38ed64bf6a1f01000000000000000083106115d0577a184f03e93ff9f4daa797ed6e38ed64bf6a1f01000000000000000083816115c6576115c561230d565b5b0492506040810190505b6d04ee2d6d415b85acef8100000000831061160d576d04ee2d6d415b85acef810000000083816116035761160261230d565b5b0492506020810190505b662386f26fc10000831061163c57662386f26fc1000083816116325761163161230d565b5b0492506010810190505b6305f5e1008310611665576305f5e100838161165b5761165a61230d565b5b0492506008810190505b612710831061168a5761271083816116805761167f61230d565b5b0492506004810190505b606483106116ad57606483816116a3576116a261230d565b5b0492506002810190505b600a83106116bc576001810190505b80915050919050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b6000604051905090565b600080fd5b600080fd5b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b611731816116fc565b811461173c57600080fd5b50565b60008135905061174e81611728565b92915050565b60006020828403121561176a576117696116f2565b5b60006117788482850161173f565b91505092915050565b60008115159050919050565b61179681611781565b82525050565b60006020820190506117b1600083018461178d565b92915050565b600081519050919050565b600082825260208201905092915050565b60005b838110156117f15780820151818401526020810190506117d6565b60008484015250505050565b6000601f19601f8301169050919050565b6000611819826117b7565b61182381856117c2565b93506118338185602086016117d3565b61183c816117fd565b840191505092915050565b60006020820190508181036000830152611861818461180e565b905092915050565b6000819050919050565b61187c81611869565b811461188757600080fd5b50565b60008135905061189981611873565b92915050565b6000602082840312156118b5576118b46116f2565b5b60006118c38482850161188a565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006118f7826118cc565b9050919050565b611907816118ec565b82525050565b600060208201905061192260008301846118fe565b92915050565b611931816118ec565b811461193c57600080fd5b50565b60008135905061194e81611928565b92915050565b6000806040838503121561196b5761196a6116f2565b5b60006119798582860161193f565b925050602061198a8582860161188a565b9150509250929050565b6000806000606084860312156119ad576119ac6116f2565b5b60006119bb8682870161193f565b93505060206119cc8682870161193f565b92505060406119dd8682870161188a565b9150509250925092565b6000602082840312156119fd576119fc6116f2565b5b6000611a0b8482850161193f565b91505092915050565b611a1d81611869565b82525050565b6000602082019050611a386000830184611a14565b92915050565b611a4781611781565b8114611a5257600080fd5b50565b600081359050611a6481611a3e565b92915050565b60008060408385031215611a8157611a806116f2565b5b6000611a8f8582860161193f565b9250506020611aa085828601611a55565b9150509250929050565b600080fd5b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b611aec826117fd565b810181811067ffffffffffffffff82111715611b0b57611b0a611ab4565b5b80604052505050565b6000611b1e6116e8565b9050611b2a8282611ae3565b919050565b600067ffffffffffffffff821115611b4a57611b49611ab4565b5b611b53826117fd565b9050602081019050919050565b82818337600083830152505050565b6000611b82611b7d84611b2f565b611b14565b905082815260208101848484011115611b9e57611b9d611aaf565b5b611ba9848285611b60565b509392505050565b600082601f830112611bc657611bc5611aaa565b5b8135611bd6848260208601611b6f565b91505092915050565b60008060008060808587031215611bf957611bf86116f2565b5b6000611c078782880161193f565b9450506020611c188782880161193f565b9350506040611c298782880161188a565b925050606085013567ffffffffffffffff811115611c4a57611c496116f7565b5b611c5687828801611bb1565b91505092959194509250565b60008060408385031215611c7957611c786116f2565b5b6000611c878582860161193f565b9250506020611c988582860161193f565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680611ce957607f821691505b602082108103611cfc57611cfb611ca2565b5b50919050565b7f4552433732313a20617070726f76616c20746f2063757272656e74206f776e6560008201527f7200000000000000000000000000000000000000000000000000000000000000602082015250565b6000611d5e6021836117c2565b9150611d6982611d02565b604082019050919050565b60006020820190508181036000830152611d8d81611d51565b9050919050565b7f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60008201527f6b656e206f776e6572206f7220617070726f76656420666f7220616c6c000000602082015250565b6000611df0603d836117c2565b9150611dfb82611d94565b604082019050919050565b60006020820190508181036000830152611e1f81611de3565b9050919050565b7f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560008201527f72206f7220617070726f76656400000000000000000000000000000000000000602082015250565b6000611e82602d836117c2565b9150611e8d82611e26565b604082019050919050565b60006020820190508181036000830152611eb181611e75565b9050919050565b6000611ec3826118cc565b9050919050565b611ed381611eb8565b8114611ede57600080fd5b50565b600081519050611ef081611eca565b92915050565b600081519050611f0581611873565b92915050565b60008060408385031215611f2257611f216116f2565b5b6000611f3085828601611ee1565b9250506020611f4185828601611ef6565b9150509250929050565b600081519050611f5a81611928565b92915050565b600060208284031215611f7657611f756116f2565b5b6000611f8484828501611f4b565b91505092915050565b7f4552433732313a2061646472657373207a65726f206973206e6f74206120766160008201527f6c6964206f776e65720000000000000000000000000000000000000000000000602082015250565b6000611fe96029836117c2565b9150611ff482611f8d565b604082019050919050565b6000602082019050818103600083015261201881611fdc565b9050919050565b600081905092915050565b6000612035826117b7565b61203f818561201f565b935061204f8185602086016117d3565b80840191505092915050565b6000612067828561202a565b9150612073828461202a565b91508190509392505050565b7f4552433732313a20696e76616c696420746f6b656e2049440000000000000000600082015250565b60006120b56018836117c2565b91506120c08261207f565b602082019050919050565b600060208201905081810360008301526120e4816120a8565b9050919050565b7f4552433732313a207472616e736665722066726f6d20696e636f72726563742060008201527f6f776e6572000000000000000000000000000000000000000000000000000000602082015250565b60006121476025836117c2565b9150612152826120eb565b604082019050919050565b600060208201905081810360008301526121768161213a565b9050919050565b7f4552433732313a207472616e7366657220746f20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b60006121d96024836117c2565b91506121e48261217d565b604082019050919050565b60006020820190508181036000830152612208816121cc565b9050919050565b7f4552433732313a20617070726f766520746f2063616c6c657200000000000000600082015250565b60006122456019836117c2565b91506122508261220f565b602082019050919050565b6000602082019050818103600083015261227481612238565b9050919050565b7f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560008201527f63656976657220696d706c656d656e7465720000000000000000000000000000602082015250565b60006122d76032836117c2565b91506122e28261227b565b604082019050919050565b60006020820190508181036000830152612306816122ca565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061237682611869565b915061238183611869565b92508282039050818111156123995761239861233c565b5b92915050565b60006123aa82611869565b91506123b583611869565b92508282019050808211156123cd576123cc61233c565b5b92915050565b600081519050919050565b600082825260208201905092915050565b60006123fa826123d3565b61240481856123de565b93506124148185602086016117d3565b61241d816117fd565b840191505092915050565b600060808201905061243d60008301876118fe565b61244a60208301866118fe565b6124576040830185611a14565b818103606083015261246981846123ef565b905095945050505050565b60008151905061248381611728565b92915050565b60006020828403121561249f5761249e6116f2565b5b60006124ad84828501612474565b9150509291505056fea26469706673582212204ddc53f0ec987702a5eae9f5da52d4aeef3f43392954be005af4d3ccad89ffd464736f6c63430008100033";

type ERC721LinkedConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC721LinkedConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC721Linked__factory extends ContractFactory {
  constructor(...args: ERC721LinkedConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    name: PromiseOrValue<string>,
    symbol: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ERC721Linked> {
    return super.deploy(name, symbol, overrides || {}) as Promise<ERC721Linked>;
  }
  override getDeployTransaction(
    name: PromiseOrValue<string>,
    symbol: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(name, symbol, overrides || {});
  }
  override attach(address: string): ERC721Linked {
    return super.attach(address) as ERC721Linked;
  }
  override connect(signer: Signer): ERC721Linked__factory {
    return super.connect(signer) as ERC721Linked__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC721LinkedInterface {
    return new utils.Interface(_abi) as ERC721LinkedInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC721Linked {
    return new Contract(address, _abi, signerOrProvider) as ERC721Linked;
  }
}
