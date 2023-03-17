import { jest } from "@jest/globals";
import voucherService from "../src/services/voucherService";
import voucherRepository from "../src/repositories/voucherRepository";
import { Voucher } from "@prisma/client";


describe("create voucher unit test", () => {

  it("should create an voucher", async () => {

    const fakeVoucher: Voucher = { 
      id: 1, 
      code: "a1b2c3d4", 
      discount: 10, 
      used: false 
    };

    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => {
        return undefined;
      });

    jest
      .spyOn(voucherRepository, "createVoucher")
      .mockImplementationOnce((): any => { });

    const result = await voucherService.createVoucher(fakeVoucher.code, fakeVoucher.discount);

    expect(result).toEqual(undefined);
    expect(voucherRepository.createVoucher).toBeCalledTimes(1);

  });

  it("it should not be able to create voucher", () => {

    expect(async () => {

      const fakeVoucher = {
        id: 1,
        code: "a1b2c3d4",
        discount: 10,
        used: false
      };

      jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce(():any => {
        return fakeVoucher;
      });

      await voucherRepository.createVoucher(fakeVoucher.code, fakeVoucher.discount);

    }).rejects.toBeInstanceOf(Error);
  });
});

describe("apply voucher unit test", () => {
  
  // it("should apply an voucher", async () => {
   
  //   const fakeVoucher: Voucher = { 
  //     id: 1, 
  //     code: "a1b2c3d4", 
  //     discount: 10, 
  //     used: false 
  //   };

  //   jest
  //   .spyOn(voucherRepository, "getVoucherByCode")
  //   .mockImplementationOnce((): any => {
  //     return fakeVoucher;
  //   });

  //   const fakeAmount = 100;



  // });
  it("shoulb not be able to apply discount to values below 100", async () => {
    const fakeVoucher = {
      id: 1,
      code: "a1b2c3d4",
      discount: 10,
      used: false
    };

    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {
      return [fakeVoucher];
    });

    // jest.spyOn(voucherRepository, "useVoucher").mockImplementationOnce(():any => { });

    const fakeAmount = 50;
    const fakeOrder = await voucherService.applyVoucher(fakeVoucher.code, fakeAmount);
    expect(fakeOrder.amount).toBe(fakeAmount);
    expect(fakeOrder.discount).toBe(10);
    expect(fakeOrder.finalAmount).toBe(fakeAmount);
    expect(fakeOrder.applied).toBe(false);

  })
});