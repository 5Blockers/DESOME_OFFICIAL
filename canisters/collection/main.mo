import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import List "mo:base/List";
import NFTActor "../nft/main";
import Principal "mo:base/Principal";
import Text "mo:base/Principal";
import Time "mo:base/Time";
actor Collection {
    private type Item = {
        ownerItem: Principal;
        price: Nat;
        startPrice : Nat;
        startTime : Int;
    };
    public type Offer = {
        price : Nat;
        from : Principal;
    };
    private var offerPriceMaps = HashMap.HashMap<Principal, List.List<Offer>>(1, Principal.equal, Principal.hash);
    // danh sach cac nft
    private var nftMaps = HashMap.HashMap<Principal, NFTActor.NFT>(1, Principal.equal, Principal.hash);
    // danh sach cac owner key la Prin, value la Prin list de map voi tung cai NFT
    private var ownerMaps = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);
    // list nhung cai nft
    private var itemMaps = HashMap.HashMap<Principal, Item>(1, Principal.equal, Principal.hash); 


    public query func getStartPriceNFT(principal:Principal) : async Nat {
        var item : Item = switch(itemMaps.get(principal)){
            case null return 0;
            case (?v) v;
        };
        return item.startPrice;
    };
    //dau gia
    public func createOffer(newPrice : Nat, newFrom : Principal, nft : Principal) : async Text {
        var ownerNFTs : NFTActor.NFT = switch(nftMaps.get(nft)) {
            case null return "NFT does not exist";
            case (?result) result;
        };
        var itemNFTs : Item = switch(itemMaps.get(nft)) {
            case null return "NFT does not exist";
            case (?result) result;
        };
        var itemOffer : List.List<Offer> = switch(offerPriceMaps.get(Principal.fromActor(ownerNFTs))) {
            case null return "Ahihi";
            case (?v) v;
        };
        if(List.size(itemOffer) < 1) {
            if(newPrice < itemNFTs.startPrice) {
                return "Ai cho giá bé hơn";
            }
            else {
                var offer : Offer = {
                    price = newPrice;
                    from = newFrom
                };
                var newItemNFTs : Item = {
                    price = itemNFTs.price;
                    ownerItem = itemNFTs.ownerItem;
                    startPrice = itemNFTs.startPrice;
                    startTime = Time.now();
                };
                itemOffer := List.push(offer,itemOffer);
                offerPriceMaps.put(Principal.fromActor(ownerNFTs),itemOffer);
                itemMaps.put(Principal.fromActor(ownerNFTs),newItemNFTs);
                return "Create offer successfully";
            };
        } else {
            var lastOffer : Offer = switch(List.last(itemOffer)) {
                case null return "Error";
                case (?v) v;
            };
            if (newPrice <= lastOffer.price) {
                return "Ai cho giá bé hơn";

            } else {
                var offer : Offer = {
                    price = newPrice;
                    from = newFrom
                };
                itemOffer := List.push(offer,itemOffer);
                offerPriceMaps.put(Principal.fromActor(ownerNFTs),itemOffer);
                return "Create offer successfully";
            };
        };
    };

    let n : Nat = 2; //3 days
    let interval : Nat = 6;
    var count : Nat = 1;
    system func heartbeat() : async () {
        if (count % n == 0) {
            Debug.print("ping");
            executeOffer();
        };
        count += 1;
    };

    public func executeOffer() {
        let now = Time.now();
        for ((nftPrincipal, offers) in offerPriceMaps.entries()) {
            if (List.size(offers) > 0) {
                var itemNFTs : Item = switch(itemMaps.get(nftPrincipal)) {
                    case null return;
                    case (?result) result;
                };
                if (now - itemNFTs.startTime >= interval) {
                    var ownerNFTs : NFTActor.NFT = switch(nftMaps.get(nftPrincipal)) {
                        case null return;
                        case (?result) result;
                    };
                    let oldOwner = await ownerNFTs.getOwner();
                    let offer : Offer = switch(List.last(offers)) {
                        case null return;
                        case (?v) v;
                    };
                    let newOwner = offer.from;
                    var text : Text =  await transfer(nftPrincipal, oldOwner, newOwner);
                    let newOffer = List.nil<Offer>();
                    offerPriceMaps.put(nftPrincipal, newOffer);
                    var newItemNFTs : Item = {
                        price = itemNFTs.price;
                        ownerItem = newOwner;
                        startPrice = itemNFTs.startPrice;
                        startTime = 0;
                    };
                    itemMaps.put(nftPrincipal, newItemNFTs);
                    }
            };
        }; 
    };
 


    public shared({caller}) func mint(name : Text, assest: Text, collection : Text, description : Text) : async Principal {
        let owner : Principal = caller;
        Cycles.add(100_500_000_000);
        let newNFT = await NFTActor.NFT(name, assest, collection, owner, description, nftMaps.size());
        let nftPrincipal = await newNFT.getCanisterID();
        offerPriceMaps.put(nftPrincipal, List.nil<Offer>());
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

    public shared({caller}) func itemList(id: Principal, price : Nat, startPrice : Nat) : async Text {
        var item : NFTActor.NFT = switch (nftMaps.get(id)) {
            case null return "NFT does not exist";
            case (?result) result;
        };
        let owner : Principal = await item.getOwner();
        if (Principal.equal(owner, caller)) {
            let newItem : Item = {
                ownerItem = owner;
                price = price;
                startPrice = startPrice;
                startTime = 0;
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

    public shared({caller}) func updateNFT(principal : Principal, name : Text, collection : Text, description : Text, isSale : Bool, newPrice : Nat, newStartPrice : Nat) : async Text {
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
                        startPrice = newStartPrice;
                        startTime = 0;
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