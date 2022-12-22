/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  ManaReserve,
  ManaReserveInterface,
} from "../../contracts/ManaReserve";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "world",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "WorldNotConnected",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "contract ISuperToken",
        name: "mana",
        type: "address",
      },
    ],
    name: "connectWorld",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
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
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "int96",
        name: "flowIncrease",
        type: "int96",
      },
    ],
    name: "updateManaFlow",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405260008060146101000a81548160ff0219169083151502179055503480156200002b57600080fd5b506040516200136c3803806200136c8339818101604052810190620000519190620001bf565b62000071620000656200008960201b60201c565b6200009160201b60201c565b62000082816200009160201b60201c565b50620001f1565b600033905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600062000187826200015a565b9050919050565b62000199816200017a565b8114620001a557600080fd5b50565b600081519050620001b9816200018e565b92915050565b600060208284031215620001d857620001d762000155565b5b6000620001e884828501620001a8565b91505092915050565b61116b80620002016000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063192eb6521461005c578063715018a6146100785780638da5cb5b14610082578063a81dbb1e146100a0578063f2fde38b146100bc575b600080fd5b61007660048036038101906100719190610aa8565b6100d8565b005b61008061018e565b005b61008a6101a2565b6040516100979190610ae4565b60405180910390f35b6100ba60048036038101906100b59190610b38565b6101cb565b005b6100d660048036038101906100d19190610b91565b61026a565b005b6100e06102ed565b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555061016f336064600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1661036b9092919063ffffffff16565b506001600060146101000a81548160ff02191690831515021790555050565b6101966102ed565b6101a0600061051e565b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6101d36102ed565b600060149054906101000a900460ff16610219576040517f4b2c971a00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6102663382600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166105e29092919063ffffffff16565b5050565b6102726102ed565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036102e1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102d890610c41565b60405180910390fd5b6102ea8161051e565b50565b6102f5610795565b73ffffffffffffffffffffffffffffffffffffffff166103136101a2565b73ffffffffffffffffffffffffffffffffffffffff1614610369576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161036090610cad565b60405180910390fd5b565b60008060006103798661079d565b915091508173ffffffffffffffffffffffffffffffffffffffff166339255d5b828373ffffffffffffffffffffffffffffffffffffffff166362fc305e8a8a8a600067ffffffffffffffff8111156103d4576103d3610ccd565b5b6040519080825280601f01601f1916602001820160405280156104065781602001600182028036833780820191505090505b5060405160240161041a9493929190610dfa565b604051602081830303815290604052915060e01b6020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050600067ffffffffffffffff81111561047757610476610ccd565b5b6040519080825280601f01601f1916602001820160405280156104a95781602001600182028036833780820191505090505b506040518463ffffffff1660e01b81526004016104c893929190610e67565b6000604051808303816000875af11580156104e7573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f820116820180604052508101906105109190610fa3565b506001925050509392505050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b60008060006105f08661079d565b915091508173ffffffffffffffffffffffffffffffffffffffff166339255d5b828373ffffffffffffffffffffffffffffffffffffffff166350209a628a8a8a600067ffffffffffffffff81111561064b5761064a610ccd565b5b6040519080825280601f01601f19166020018201604052801561067d5781602001600182028036833780820191505090505b506040516024016106919493929190610dfa565b604051602081830303815290604052915060e01b6020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050600067ffffffffffffffff8111156106ee576106ed610ccd565b5b6040519080825280601f01601f1916602001820160405280156107205781602001600182028036833780820191505090505b506040518463ffffffff1660e01b815260040161073f93929190610e67565b6000604051808303816000875af115801561075e573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f820116820180604052508101906107879190610fa3565b506001925050509392505050565b600033905090565b6000807f65599bf746e17a00ea62e3610586992d88101b78eec3cf380706621fb97ea8375491507fb969d79d88acd02d04ed7ee7d43b949e7daf093d363abcfbbc43dfdfd1ce969a549050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036109a557600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036108c2578273ffffffffffffffffffffffffffffffffffffffff166320bc44256040518163ffffffff1660e01b8152600401602060405180830381865afa15801561089b573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108bf9190611001565b91505b8173ffffffffffffffffffffffffffffffffffffffff1663b6d200de7fa9214cc96615e0085d3bb077758db69497dc2dce3b2b1e97bc93c3d18d83efd36040518263ffffffff1660e01b815260040161091b9190611080565b602060405180830381865afa158015610938573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061095c91906110d9565b9050817f65599bf746e17a00ea62e3610586992d88101b78eec3cf380706621fb97ea83755807fb969d79d88acd02d04ed7ee7d43b949e7daf093d363abcfbbc43dfdfd1ce969a555b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036109e2576109e1611106565b5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610a1f57610a1e611106565b5b915091565b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610a6382610a38565b9050919050565b6000610a7582610a58565b9050919050565b610a8581610a6a565b8114610a9057600080fd5b50565b600081359050610aa281610a7c565b92915050565b600060208284031215610abe57610abd610a2e565b5b6000610acc84828501610a93565b91505092915050565b610ade81610a58565b82525050565b6000602082019050610af96000830184610ad5565b92915050565b600081600b0b9050919050565b610b1581610aff565b8114610b2057600080fd5b50565b600081359050610b3281610b0c565b92915050565b600060208284031215610b4e57610b4d610a2e565b5b6000610b5c84828501610b23565b91505092915050565b610b6e81610a58565b8114610b7957600080fd5b50565b600081359050610b8b81610b65565b92915050565b600060208284031215610ba757610ba6610a2e565b5b6000610bb584828501610b7c565b91505092915050565b600082825260208201905092915050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b6000610c2b602683610bbe565b9150610c3682610bcf565b604082019050919050565b60006020820190508181036000830152610c5a81610c1e565b9050919050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b6000610c97602083610bbe565b9150610ca282610c61565b602082019050919050565b60006020820190508181036000830152610cc681610c8a565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000819050919050565b6000610d21610d1c610d1784610a38565b610cfc565b610a38565b9050919050565b6000610d3382610d06565b9050919050565b6000610d4582610d28565b9050919050565b610d5581610d3a565b82525050565b610d6481610aff565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610da4578082015181840152602081019050610d89565b60008484015250505050565b6000601f19601f8301169050919050565b6000610dcc82610d6a565b610dd68185610d75565b9350610de6818560208601610d86565b610def81610db0565b840191505092915050565b6000608082019050610e0f6000830187610d4c565b610e1c6020830186610ad5565b610e296040830185610d5b565b8181036060830152610e3b8184610dc1565b905095945050505050565b6000610e5182610d28565b9050919050565b610e6181610e46565b82525050565b6000606082019050610e7c6000830186610e58565b8181036020830152610e8e8185610dc1565b90508181036040830152610ea28184610dc1565b9050949350505050565b600080fd5b600080fd5b610ebf82610db0565b810181811067ffffffffffffffff82111715610ede57610edd610ccd565b5b80604052505050565b6000610ef1610a24565b9050610efd8282610eb6565b919050565b600067ffffffffffffffff821115610f1d57610f1c610ccd565b5b610f2682610db0565b9050602081019050919050565b6000610f46610f4184610f02565b610ee7565b905082815260208101848484011115610f6257610f61610eb1565b5b610f6d848285610d86565b509392505050565b600082601f830112610f8a57610f89610eac565b5b8151610f9a848260208601610f33565b91505092915050565b600060208284031215610fb957610fb8610a2e565b5b600082015167ffffffffffffffff811115610fd757610fd6610a33565b5b610fe384828501610f75565b91505092915050565b600081519050610ffb81610b65565b92915050565b60006020828403121561101757611016610a2e565b5b600061102584828501610fec565b91505092915050565b6000819050919050565b6000819050919050565b60008160001b9050919050565b600061106a6110656110608461102e565b611042565b611038565b9050919050565b61107a8161104f565b82525050565b60006020820190506110956000830184611071565b92915050565b60006110a682610a58565b9050919050565b6110b68161109b565b81146110c157600080fd5b50565b6000815190506110d3816110ad565b92915050565b6000602082840312156110ef576110ee610a2e565b5b60006110fd848285016110c4565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052600160045260246000fdfea264697066735822122025fc4cc2cc4e68bedb918d57eb5e73e0250a2c57d4bac0108dfeafa30b877c0864736f6c63430008110033";

type ManaReserveConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ManaReserveConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ManaReserve__factory extends ContractFactory {
  constructor(...args: ManaReserveConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    world: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ManaReserve> {
    return super.deploy(world, overrides || {}) as Promise<ManaReserve>;
  }
  override getDeployTransaction(
    world: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(world, overrides || {});
  }
  override attach(address: string): ManaReserve {
    return super.attach(address) as ManaReserve;
  }
  override connect(signer: Signer): ManaReserve__factory {
    return super.connect(signer) as ManaReserve__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ManaReserveInterface {
    return new utils.Interface(_abi) as ManaReserveInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ManaReserve {
    return new Contract(address, _abi, signerOrProvider) as ManaReserve;
  }
}
