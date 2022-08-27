import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import List "mo:base/List";
import NFTActor "../nft/main";
import Principal "mo:base/Principal";
import Text "mo:base/Principal";
actor Collection {
    Debug.print("Collection works!");
    private type Item = {
        ownerItem: Principal;
        price: Nat;
    };

    // danh sach cac nft
    private var nftMaps = HashMap.HashMap<Principal, NFTActor.NFT>(1, Principal.equal, Principal.hash);
    // danh sach cac owner key la Prin, value la Prin list de map voi tung cai NFT
    private var ownerMaps = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);
    // list nhung cai nft
    private var itemMaps = HashMap.HashMap<Principal, Item>(1, Principal.equal, Principal.hash); 

    public shared({caller}) func mint(name : Text, assest: Text, collection : Text, description : Text) : async Principal {
        let owner : Principal = caller;
        Cycles.add(100_500_000_000);
        let newNFT = await NFTActor.NFT(name, assest, collection, owner, description, nftMaps.size());
        let nftPrincipal = await newNFT.getCanisterID();
        nftMaps.put(nftPrincipal, newNFT);
        addToOwner(owner, nftPrincipal);
        return nftPrincipal;
    };

    private func addToOwner(owner : Principal, nftID : Principal) {
        var ownerNFTs : List.List<Principal> = switch(ownerMaps.get(owner)) {
            case null List.nil<Principal>();
            case (?result) result;
        };
        ownerNFTs := List.push(nftID, ownerNFTs);
        ownerMaps.put(owner, ownerNFTs);
    };

    public query func getOwnerNFT(user: Principal) : async [Principal] {
        var list : List.List<Principal> = switch (ownerMaps.get(user)) {
            case null List.nil<Principal>();
            case (?result) result;
        };
        return List.toArray(list);
    };

    public query func getNftKeyList() : async [Principal] {
      return Iter.toArray(itemMaps.keys())
    };
    public query func getNftValueList() : async [Item] {
      return Iter.toArray(itemMaps.vals())
    };

    public query func getNftLinkList(invalidLink : Text) : async [Text] {
        var linkList : List.List<Text> = null;
        for (nft in nftMaps.vals()) {
            // var link = await nft.getAssest();
            // if (link != invalidLink) {
            //     linkList.push(link);
            // }
            // Debug.show(nft);
        };
        return List.toArray(linkList);
    }; 

    public shared({caller}) func itemList(id: Principal) : async Text {
        var item : NFTActor.NFT = switch (nftMaps.get(id)) {
            case null return "NFT does not exist";
            case (?result) result;
        };
        let owner : Principal = await item.getOwner();
        if (Principal.equal(owner, caller)) {
            let newItem : Item = {
                ownerItem = owner;
                price = 0;
            };
            itemMaps.put(id, newItem);
            return "Success";
        } else {
            return "You are not the owner";
        }
    };
    public query func getOriginalOwner(id: Principal) : async Principal {
        var item : Item = switch(itemMaps.get(id)) {
            case null return Principal.fromText("");
            case (?result) result;
        };
        return item.ownerItem;
    };
    public query func isListed(id: Principal) : async Bool {
      if (itemMaps.get(id) == null) {
        return false;
      } else{
        return true;
      }
    };

    public query func getCollectionCanisterID() : async Principal {
      return Principal.fromActor(Collection);
    };
public query func getItemByNFT(id : Principal) : async ?Item {
        itemMaps.get(id);
    };
   public shared({caller}) func transfer(id: Principal, ownerID: Principal, newOwnerID: Principal) : async Text {
        var nftPurchase : NFTActor.NFT = switch (nftMaps.get(id)) {
            case null return "NFT does not exist";
            case (?result) result;
        };
        let transferResult = await nftPurchase.transferTo(newOwnerID);
        Debug.print(Principal.toText(newOwnerID));
        if (transferResult == "Success") {
            itemMaps.delete(id);
            
            var ownerNFT : List.List<Principal> = switch (ownerMaps.get(ownerID)) {
                
                case null List.nil<Principal>();
                case (?result) result;
                
            };
            Debug.print(debug_show("Before:", ownerNFT));
            ownerNFT := List.filter(ownerNFT, func (itemID : Principal) : Bool {
                return itemID != id;
            });
            Debug.print(debug_show("After:", ownerNFT));
           
            addToOwner(newOwnerID, id);
             ownerMaps.put(ownerID, ownerNFT);
            return "Success";
        } else {
            return transferResult;
        }
    };

    public shared({caller}) func updateNFT(principal : Principal, name : Text, collection : Text, description : Text, isSale : Bool, newPrice : Nat) : async Text {
        switch(Principal.toText(caller)) {
            case("2vxsx-fae") return "Not autheticated";
            case(_) {
                var nftUpdate : NFTActor.NFT = switch (nftMaps.get(principal)) {
                    case null return "NFT does not exist";
                    case (?result) result;
                };
                nftUpdate.setName(name);
                nftUpdate.setCollection(collection);
                nftUpdate.setDescription(description);
                
                if (isSale) {
                    nftUpdate.setStatus("active");
                    let newItem : Item = {
                        ownerItem = await nftUpdate.getOwner();
                        price = newPrice;
                    };
                    // item.price = price;
                    itemMaps.put(principal, newItem);
                };
                return "Update NFT successfully";
            };
        };
        
    };

    // public shared({caller}) func getItemList() : async HashMap.HashMap<NFTActor.NFT, Item> {
    //     let owner : Principal = caller;
    //     var nfts = HashMap.mapFilter(nftMaps, func(nft: NFTActor.NFT): Bool {
    //         return owner.equal(await nft.getOwner());
    //     });
    //     var items = HashMap.mapFilter(itemMaps, func(item: Item): Bool {
    //         return owner.equal(await nft.getOwner());
    //     });
    // }

    public shared({caller}) func transmit(id: Principal, ownerID: Principal, newOwnerID: Principal) : async Text {
        var nftPurchase : NFTActor.NFT = switch (nftMaps.get(id)) {
            case null return "NFT does not exist";
            case (?result) result;
        };
        let transferResult = await nftPurchase.transferTo(newOwnerID);
        Debug.print(Principal.toText(newOwnerID));
        if (transferResult == "Success") {
            itemMaps.delete(id);
            var ownerNFT : List.List<Principal> = switch (ownerMaps.get(ownerID)) {
                case null List.nil<Principal>();
                case (?result) result;
            };
            ownerNFT := List.filter(ownerNFT, func (itemID : Principal) : Bool {
                return itemID != id;
            });
            addToOwner(newOwnerID, id);
            return "Success";
        } else {
            // Debug.print("Else run")
            return transferResult;
        }
    };


    public shared({caller}) func new_transfer(to: Principal, tokenId: Principal) : async Text {
        var nftPurchase : NFTActor.NFT = switch (nftMaps.get(tokenId)) {
            case null return "NFT does not exist";
            case (?result) result;
        };
        let transferResult = await nftPurchase.transferTo(to);
        Debug.print(Principal.toText(to));
        if (transferResult == "Success") {
            itemMaps.delete(tokenId);
            var ownerNFT : List.List<Principal> = switch (ownerMaps.get(tokenId)) {
                case null List.nil<Principal>();
                case (?result) result;
            };
            ownerNFT := List.filter(ownerNFT, func (itemID : Principal) : Bool {
                return itemID != to;
            });
            addToOwner(tokenId, to);
            return "Success";
        } else {
            return transferResult;
        }
    };

}