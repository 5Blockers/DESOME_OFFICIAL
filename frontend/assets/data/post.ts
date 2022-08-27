import { Principal, User } from "./user"
import { sang, long, tien } from "./user"
import pic1 from "../img/nft/1.png"
import pic2 from "../img/nft/2.png"
import pic3 from "../img/nft/3.png"
import pic4 from "../img/nft/4.png"
import pic5 from "../img/nft/5.png"
export interface Comment {
  // postId: Number
  // id: Number
  // author: User
  // content: string
  text: string
  postedBy: {
    _id: string
    displayname: string
    avatar: string
    tagname: string
  }
  _id: string
}
export interface Post {
  _id: string
  principal: Principal // author: User
  resources: Array<string>
  postedBy: {
    _id: string
    displayname: string
    avatar: string
    tagname: string
  }
  caption: string
  likes: Array<Principal> | null
  comments: Array<Comment> | null
  createdAt: string
  updatedAt: string
  privacy: boolean
}

// export const postList: Array<Post> = [
//   {
//     id: 1,
//     principal:
//       "iyvch-vd6ud-w6c5i-harvo-xwug4-oyjvd-sshqq-bfkku-iop4u-gxryl-gae",
//     caption: "Say Hello World",
//     like: null,
//     images: [pic3, pic5],
//     comments: [
//       {
//         postId: 1,
//         id: 1,
//         author: long,
//         content:
//           "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout",
//       },
//       {
//         postId: 1,
//         id: 2,
//         author: tien,
//         content:
//           "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable",
//       },
//     ],
//   },
//   {
//     id: 2,
//     principal:
//       "iyvch-vd6ud-w6c5i-harvo-xwug4-oyjvd-sshqq-bfkku-iop4u-gxryl-gae",
//     caption:
//       "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged",
//     like: null,
//     comments: [],
//   },
//   {
//     id: 3,
//     principal:
//       "jbl7b-wavjw-um5z7-ik7ww-xhayt-kxszb-pyhfh-rr4le-uwpvi-panrm-eqe",
//     caption:
//       "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged",
//     like: null,
//     images: [pic1, pic2],
//     comments: [],
//   },
// ]
