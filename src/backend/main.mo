import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Inherit blob storage logic
  include MixinStorage();

  // User profile type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Ad type
  type Ad = {
    id : Nat;
    title : Text;
    description : Text;
    imageId : Storage.ExternalBlob;
    externalLink : Text;
    category : Text;
    isActive : Bool;
    createdAt : Int;
  };

  module Ad {
    public func compareByCreatedAt(a1 : Ad, a2 : Ad) : Order.Order {
      Nat.compare(a1.id, a2.id);
    };
    public func compareByCategory(a1 : Ad, a2 : Ad) : Order.Order {
      switch (Text.compare(a1.category, a2.category)) {
        case (#equal) { compareByCreatedAt(a1, a2) };
        case (order) { order };
      };
    };
  };

  let adsList = List.empty<Ad>();
  var adCount = 0;

  // Inquiry type
  type Inquiry = {
    id : Nat;
    name : Text;
    email : Text;
    company : Text;
    message : Text;
    createdAt : Int;
  };

  let inquiries = List.empty<Inquiry>();
  var inquiryCount = 0;

  // Ad management functions - Admin only
  public shared ({ caller }) func createAd(title : Text, description : Text, imageId : Storage.ExternalBlob, externalLink : Text, category : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create ads");
    };

    let adId = adCount;
    let ad : Ad = {
      id = adId;
      title;
      description;
      imageId;
      externalLink;
      category;
      isActive = false;
      createdAt = getCurrentTimestamp();
    };
    adsList.add(ad);
    adCount += 1;
    adId;
  };

  public shared ({ caller }) func updateAd(adId : Nat, title : Text, description : Text, imageId : Storage.ExternalBlob, externalLink : Text, category : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update ads");
    };

    let currentAds = adsList.toArray();
    let updatedAds = currentAds.map(
      func(ad) {
        if (ad.id == adId) {
          return {
            id = adId;
            title;
            description;
            imageId;
            externalLink;
            category;
            isActive = ad.isActive;
            createdAt = ad.createdAt;
          };
        };
        ad;
      }
    );

    adsList.clear();
    adsList.addAll(updatedAds.values());
  };

  public shared ({ caller }) func deleteAd(adId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete ads");
    };

    let filteredAds = adsList.toArray().filter(func(ad) { ad.id != adId });
    adsList.clear();
    adsList.addAll(filteredAds.values());
  };

  public shared ({ caller }) func toggleAdActiveStatus(adId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can toggle ad status");
    };

    let currentAds = adsList.toArray();
    let updatedAds = currentAds.map(
      func(ad) {
        if (ad.id == adId) {
          return {
            id = ad.id;
            title = ad.title;
            description = ad.description;
            imageId = ad.imageId;
            externalLink = ad.externalLink;
            category = ad.category;
            isActive = not ad.isActive;
            createdAt = ad.createdAt;
          };
        };
        ad;
      }
    );

    adsList.clear();
    adsList.addAll(updatedAds.values());
  };

  // Public query functions - No authorization needed
  public query func getActiveAds() : async [Ad] {
    adsList.toArray().filter(func(ad) { ad.isActive });
  };

  public query func getAdsByCategory(category : Text) : async [Ad] {
    adsList.toArray().filter(
      func(ad) { ad.isActive and Text.equal(ad.category, category) }
    );
  };

  public query func getAdById(adId : Nat) : async ?Ad {
    adsList.toArray().find(
      func(ad) { ad.id == adId }
    );
  };

  // Inquiry management
  // Anyone can submit an inquiry - No authorization needed
  public shared func submitInquiry(name : Text, email : Text, company : Text, message : Text) : async () {
    let inquiry : Inquiry = {
      id = inquiryCount;
      name;
      email;
      company;
      message;
      createdAt = getCurrentTimestamp();
    };
    inquiries.add(inquiry);
    inquiryCount += 1;
  };

  // Only admin can view all inquiries
  public query ({ caller }) func getAllInquiries() : async [Inquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view inquiries");
    };
    inquiries.toArray();
  };

  // Helper function to get current timestamp
  func getCurrentTimestamp() : Int {
    // Placeholder implementation, replace with actual timestamp logic
    0;
  };
};
