// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Escrow} from "../src/Escrow.sol";

contract EscrowTest is Test {
    Escrow public escrow;
    address payable public buyer;
    address payable public seller;

    function setUp() public {
        escrow = new Escrow();
        buyer = payable(address(uint160(uint256(keccak256(abi.encodePacked("buyer"))))));
        seller = payable(address(uint160(uint256(keccak256(abi.encodePacked("seller"))))));
    }

    function test_CreateEscrow() public {
        vm.deal(buyer, 1 ether); // Ensure buyer has 1 ether
        uint256 initialBuyerBalance = buyer.balance;
        
        vm.prank(buyer);
        uint256 escrowId = escrow.createEscrow{value: 1 ether}(seller);

        (address payable _buyer, address payable _seller, uint256 amount, Escrow.Status status) = escrow.escrows(escrowId);
        
        assertEq(_buyer, buyer);
        assertEq(_seller, seller);
        assertEq(amount, 1 ether);
        assertEq(uint(status), uint(Escrow.Status.Created));
        assertEq(buyer.balance, initialBuyerBalance - 1 ether);
    }

    function test_FundEscrow() public {
        vm.deal(buyer, 1 ether); // Ensure buyer has 1 ether
        vm.prank(buyer);
        uint256 escrowId = escrow.createEscrow{value: 1 ether}(seller);

        vm.prank(buyer);
        escrow.fundEscrow(escrowId);

        (, , , Escrow.Status status) = escrow.escrows(escrowId);
        assertEq(uint(status), uint(Escrow.Status.Funded));
    }

    function test_RenderService() public {
        vm.deal(buyer, 1 ether); // Ensure buyer has 1 ether
        vm.prank(buyer);
        uint256 escrowId = escrow.createEscrow{value: 1 ether}(seller);

        vm.prank(buyer);
        escrow.fundEscrow(escrowId);

        vm.prank(seller);
        escrow.renderService(escrowId);

        (, , , Escrow.Status status) = escrow.escrows(escrowId);
        assertEq(uint(status), uint(Escrow.Status.ServiceRendered));
    }

    function test_ReleaseFunds() public {
        vm.deal(buyer, 1 ether); // Ensure buyer has 1 ether
        vm.prank(buyer);
        uint256 escrowId = escrow.createEscrow{value: 1 ether}(seller);

        vm.prank(buyer);
        escrow.fundEscrow(escrowId);

        vm.prank(seller);
        escrow.renderService(escrowId);

        uint256 sellerInitialBalance = seller.balance;

        vm.prank(buyer);
        escrow.releaseFunds(escrowId);

        (, , , Escrow.Status status) = escrow.escrows(escrowId);
        assertEq(uint(status), uint(Escrow.Status.Completed));
        assertEq(seller.balance, sellerInitialBalance + 1 ether);
    }

    function test_OpenDispute() public {
        vm.deal(buyer, 1 ether); // Ensure buyer has 1 ether
        vm.prank(buyer);
        uint256 escrowId = escrow.createEscrow{value: 1 ether}(seller);

        vm.prank(buyer);
        escrow.fundEscrow(escrowId);

        vm.prank(seller);
        escrow.renderService(escrowId);

        vm.prank(buyer);
        escrow.openDispute(escrowId);

        (, , , Escrow.Status status) = escrow.escrows(escrowId);
        assertEq(uint(status), uint(Escrow.Status.Disputed));
    }

    function test_SettleDispute() public {
        vm.deal(buyer, 1 ether); // Ensure buyer has 1 ether
        vm.prank(buyer);
        uint256 escrowId = escrow.createEscrow{value: 1 ether}(seller);

        vm.prank(buyer);
        escrow.fundEscrow(escrowId);

        vm.prank(seller);
        escrow.renderService(escrowId);

        vm.prank(buyer);
        escrow.openDispute(escrowId);

        uint256 buyerInitialBalance = buyer.balance;

        // Settle dispute in favor of the buyer
        vm.prank(escrow.admin());
        escrow.settleDispute(escrowId, buyer);

        (, , , Escrow.Status status) = escrow.escrows(escrowId);
        assertEq(uint(status), uint(Escrow.Status.Completed));
        assertEq(buyer.balance, buyerInitialBalance + 1 ether);
    }
}
