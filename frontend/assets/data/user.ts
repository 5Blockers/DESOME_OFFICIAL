import sangAvatar from "../img/avatar/sang.jpg"
import tienAvatar from "../img/avatar/viet_tien.jpeg"
import longAvatar from "../img/avatar/hoang_long.jpeg"
import thienAvatar from "../img/avatar/duc_thien.jpeg"
import sangBackground from "../img/avatar/hackathon_fpt.png"
export type Principal = string
export interface User {
  principal: Principal
  displayname: string | null
  tagname: string
  avatar: string | null
  background: string | null
  email: string | null
  bio: string | null
  following: Array<Principal> | []
  followers: Array<Principal> | []
  flag: Number | 0
}

export const sang: User = {
  principal: "iyvch-vd6ud-w6c5i-harvo-xwug4-oyjvd-sshqq-bfkku-iop4u-gxryl-gae",
  displayname: "Trần Quang Sáng",
  tagname: "@sang_tran127",
  avatar: sangAvatar,
  background: sangBackground,
  email: "sang@gmail.com",
  bio: "Sang dep chai qua",
  followers: [],
  following: [],
  flag: 0,
}
export const long: User = {
  principal: "jbl7b-wavjw-um5z7-ik7ww-xhayt-kxszb-pyhfh-rr4le-uwpvi-panrm-eqe",
  displayname: "Đinh Hoàng Long",
  tagname: "@long56642002",
  avatar: longAvatar,
  background: "",
  email: "sang@gmail.com",
  bio: "",
  followers: [],
  following: [],
  flag: 0,
}
export const tien: User = {
  principal: "uhswz-uvbsk-rh35i-qwgpz-xtnn6-5fnf7-roomw-5yf4n-6csor-yjteh-dae",
  displayname: "Ngô Việt Tiến",
  tagname: "@viettien1602",
  avatar: tienAvatar,
  background: "",
  email: "sang@gmail.com",
  bio: "",
  followers: [
    "jbl7b-wavjw-um5z7-ik7ww-xhayt-kxszb-pyhfh-rr4le-uwpvi-panrm-eqe",
    "iyvch-vd6ud-w6c5i-harvo-xwug4-oyjvd-sshqq-bfkku-iop4u-gxryl-gae",
  ],
  following: [],
  flag: 0,
}
export const thien: User = {
  principal: "uhswz-uvbsk-rh32z-qwgpz-xtnn6-5fnf7-roomw-5yf4n-6csor-yjteh-azx",
  displayname: "Nguyen Duc Thien",
  tagname: "@thien123",
  avatar: thienAvatar,
  background: "",
  email: "thien@gmail.com",
  bio: "",
  followers: [],
  following: [],
  flag: 0,
}
export const userList: Array<User> = [sang, long, tien]
export const userFollow: Array<User> = [long, tien, thien]
