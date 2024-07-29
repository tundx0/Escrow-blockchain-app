// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Escrow {
    enum Status { Created, Funded, ServiceRendered, Completed, Disputed }

    struct EscrowDetail {
        address payable buyer;
        address payable seller;
        uint256 amount;
        Status status;
    }

    address public admin;
    mapping(uint256 => EscrowDetail) public escrows;
    uint256 public escrowCount;

    event EscrowCreated(uint256 indexed escrowId, address buyer, address seller, uint256 amount);
    event EscrowFunded(uint256 indexed escrowId);
    event ServiceRendered(uint256 indexed escrowId);
    event EscrowCompleted(uint256 indexed escrowId);
    event EscrowDisputed(uint256 indexed escrowId);
    event EscrowSettled(uint256 indexed escrowId, address winner);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function createEscrow(address payable _seller) external payable returns (uint256) {
        require(msg.value > 0, "Amount should be greater than zero");
        escrowCount++;
        escrows[escrowCount] = EscrowDetail({
            buyer: payable(msg.sender),
            seller: _seller,
            amount: msg.value,
            status: Status.Created
        });

        emit EscrowCreated(escrowCount, msg.sender, _seller, msg.value);
        return escrowCount;
    }

    function fundEscrow(uint256 _escrowId) external {
        EscrowDetail storage escrow = escrows[_escrowId];
        require(escrow.status == Status.Created, "Escrow is not in Created status");
        require(msg.sender == escrow.buyer, "Only buyer can fund the escrow");

        escrow.status = Status.Funded;
        emit EscrowFunded(_escrowId);
    }

    function renderService(uint256 _escrowId) external {
        EscrowDetail storage escrow = escrows[_escrowId];
        require(escrow.status == Status.Funded, "Escrow is not in Funded status");
        require(msg.sender == escrow.seller, "Only seller can render service");

        escrow.status = Status.ServiceRendered;
        emit ServiceRendered(_escrowId);
    }

    function releaseFunds(uint256 _escrowId) external {
        EscrowDetail storage escrow = escrows[_escrowId];
        require(escrow.status == Status.ServiceRendered, "Escrow is not in ServiceRendered status");
        require(msg.sender == escrow.buyer, "Only buyer can release funds");

        escrow.seller.transfer(escrow.amount);
        escrow.status = Status.Completed;
        emit EscrowCompleted(_escrowId);
    }

    function openDispute(uint256 _escrowId) external {
        EscrowDetail storage escrow = escrows[_escrowId];
        require(escrow.status == Status.ServiceRendered, "Escrow is not in ServiceRendered status");
        require(msg.sender == escrow.buyer || msg.sender == escrow.seller, "Only buyer or seller can open dispute");

        escrow.status = Status.Disputed;
        emit EscrowDisputed(_escrowId);
    }

    function settleDispute(uint256 _escrowId, address payable _winner) external onlyAdmin {
        EscrowDetail storage escrow = escrows[_escrowId];
        require(escrow.status == Status.Disputed, "Escrow is not in Disputed status");

        _winner.transfer(escrow.amount);
        escrow.status = Status.Completed;
        emit EscrowSettled(_escrowId, _winner);
    }
}
