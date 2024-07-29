// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {Escrow} from "../src/Escrow.sol";

contract DeployEscrow is Script {
    function run() external {
        vm.startBroadcast();

        Escrow escrow = new Escrow();

        console.log("Escrow contract deployed at:", address(escrow));

        vm.stopBroadcast();
    }
}