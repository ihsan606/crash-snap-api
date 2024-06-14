# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-23.11"; # or "unstable"
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
  ];
  # Sets environment variables in the workspace
  env = {
    FIREBASE_APIKEY = "AIzaSyA4vwrehmFFfcCjomww0vbZge_ajH3wHA4";
    FIREBASE_AUTHDOMAIN = "capstone-crashsnap.firebaseapp.com";
    FIREBASE_PROJECTID="capstone-crashsnap";
    FIREBASE_STORAGEBUCKET="capstone-crashsnap.appspot.com";
    FIREBASE_MESSAGINGSENDERID=214497132579;
    FIREBASE_APPID="1:214497132579:web:0f0aedb0d6db6a847db196";
    FIREBASE_MEASUREMENTID="G-TBPRMC6541";

  };
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      # "vscodevim.vim"
    ];
    workspace = {
      # Runs when a workspace is first created with this `dev.nix` file
      onCreate = {
        npm-install = "npm install";
      };
      # To run something each time the workspace is (re)started, use the `onStart` hook
    };
    # Enable previews and customize configuration
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT"];
          manager = "web";
        };
      };
    };
  };
}