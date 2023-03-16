import { jest } from "@jest/globals";
import voucherService from "../src/services/voucherService";
import voucherRepository from "../src/repositories/voucherRepository";


describe("create voucher unit test", () => {
 
    it("should create an voucher", async () => {
    
    const fakeVoucher = {id:1, code: "a1b2c3d4", discount: 10, used:false};
    
    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => {
        return undefined;
      });

      jest
      .spyOn(voucherRepository, "createVoucher")
      .mockImplementationOnce((): any => {});

    const result = await voucherService.createVoucher(fakeVoucher.code, fakeVoucher.discount);
   
    expect(result).toEqual(undefined);
    expect(voucherRepository.createVoucher).toBeCalledTimes(1);

  });

});