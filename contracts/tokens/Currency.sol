// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Currency is ERC20, ERC20Burnable, Ownable {
    uint256 private immutable i_vat;

    constructor(address world, uint256 vat) ERC20("Polygold", "POLD") {
        _transferOwnership(world);
        i_vat = vat;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function transfer(
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        address from = _msgSender();

        uint256 tax = (amount / 100) * i_vat;
        uint256 taxedAmount = amount - tax;

        burn(tax);
        _transfer(from, to, taxedAmount);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        address spender = _msgSender();
        uint256 tax = (amount / 100) * i_vat;
        uint256 taxedAmount = amount - tax;

        _burn(from, tax);

        _spendAllowance(from, spender, amount);
        _transfer(from, to, taxedAmount);
        return true;
    }
}
