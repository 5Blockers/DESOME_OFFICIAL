import { User, sang } from "./user"
import monkey1 from "../img/nft/6.png"
import monkey2 from "../img/nft/7.png"
import monkey3 from "../img/nft/8.png"
import monkey4 from "../img/nft/9.png"
import monkey5 from "../img/nft/10.png"
import monkey6 from "../img/nft/11.png"
import monkey7 from "../img/nft/12.png"
export interface NFT {
  principalNFT: string
  name: string
  assest: string
  owner: User
  collection: string
  description: string
  onSale?: {
    price: number
  }
  status: "listed" | "inactive"
}

const nftMonkey1: NFT = {
  principalNFT: "a",
  name: "#9885",
  assest: monkey1,
  owner: sang,
  collection: "Monkey",
  description: "Lorems asdaskd",
  status: "inactive",
}
const nftMonkey2: NFT = {
  principalNFT: "b",
  name: "#9886",
  assest: monkey2,
  owner: sang,
  collection: "Monkey",
  description: "Lorems asdaskd",
  status: "inactive",
}
const nftMonkey3: NFT = {
  principalNFT: "c",
  name: "#9887",
  assest: monkey3,
  owner: sang,
  collection: "Monkey",
  description: "Lorems asdaskd",
  status: "inactive",
}

const nftMonkey4: NFT = {
  principalNFT: "d",
  name: "#9885",
  assest: monkey4,
  owner: sang,
  collection: "Monkey",
  description: "Lorems asdaskd",
  status: "inactive",
}
const nftMonkey5: NFT = {
  principalNFT: "e",
  name: "#9885",
  assest: monkey5,
  owner: sang,
  collection: "Monkey",
  description: "Lorems asdaskd",
  onSale: {
    price: 10.5,
  },
  status: "listed",
}
const nftMonkey6: NFT = {
  principalNFT: "f",
  name: "#9885",
  assest: monkey6,
  owner: sang,
  collection: "Monkey",
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
  onSale: {
    price: 9,
  },
  status: "listed",
}
const nftMonkey7: NFT = {
  principalNFT: "g",
  name: "#9885",
  assest: monkey7,
  owner: sang,
  collection: "Monkey",
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
  onSale: {
    price: 11,
  },
  status: "listed",
}
const nftMonkey8: NFT = {
  principalNFT: "h",
  name: "#9990",
  assest: monkey7,
  owner: sang,
  collection: "Monkey",
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
  onSale: {
    price: 11,
  },
  status: "inactive",
}

const nftMonkey9: NFT = {
  principalNFT: "j",
  name: "#9985",
  assest: monkey1,
  owner: sang,
  collection: "Monkey",
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
  onSale: {
    price: 11,
  },
  status: "inactive",
}

export const sangNFTs: Array<NFT> = [
  nftMonkey1,
  nftMonkey2,
  nftMonkey3,
  nftMonkey4,
  nftMonkey5,
  nftMonkey6,
  nftMonkey7,
  nftMonkey8,
  nftMonkey9,
]
export const sangNFTCollected: Array<NFT> = [
  nftMonkey1,
  nftMonkey2,
  nftMonkey3,
  nftMonkey8,
  nftMonkey9,
  nftMonkey4,
]
export const sangNFTMinted: Array<NFT> = [nftMonkey5, nftMonkey6, nftMonkey7]
