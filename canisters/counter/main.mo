actor {
    stable var currentValue: Nat = 0;

    public func increment(): async () {
        currentValue += 1;
    };
    public func sayHello() : async Nat {
        let a = 1;
        return 1;
    };
    public query func getValue(): async Nat {
        currentValue;
    };
};
