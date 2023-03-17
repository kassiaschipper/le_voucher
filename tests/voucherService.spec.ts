import { jest } from "@jest/globals";
import voucherService from "../src/services/voucherService";
import voucherRepository from "../src/repositories/voucherRepository";
import { conflictError } from "../src/utils/errorUtils";

beforeAll(() => {
  jest.clearAllMocks();
})
afterAll(() => {
  jest.clearAllMocks();
});

describe("create voucher unit test", () => {

  it("should create an voucher", async () => {

    const fakeVoucher = {
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
    const fakeVoucher = {
      id: 1,
      code: "a1b2c3d4",
      discount: 15,
      used: false
    };
    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockResolvedValueOnce(fakeVoucher);

    expect(
      voucherService.createVoucher(fakeVoucher.code, fakeVoucher.discount)
    ).rejects.toEqual(conflictError("Voucher already exist."));

  });
});

describe("apply voucher unit test", () => {

  it("should not be able to apply discount to values below 100", async () => {

    const fakeVoucher = {
      id: 1,
      code: "a1b2c3d4",
      discount: 10,
      used: false
    };

    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockResolvedValueOnce(fakeVoucher);
    jest
      .spyOn(voucherRepository, "useVoucher")
      .mockResolvedValueOnce({ ...fakeVoucher, used: true });

    const fakeAmount = 50;
    const fakeOrder = await voucherService.applyVoucher(fakeVoucher.code, fakeAmount);
    console.log(fakeOrder)

    expect(fakeOrder.amount).toBe(fakeAmount);
    expect(fakeOrder.discount).toEqual(fakeVoucher.discount);
    expect(fakeOrder.finalAmount).toBe(fakeAmount);
    expect(fakeOrder.applied).toBe(false);

  });

  it("should apply an voucher", async () => {

    const fakeVoucher = {
      id: 1,
      code: "a1b2c3d4",
      discount: 10,
      used: false
    };

    jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(fakeVoucher);
    jest.spyOn(voucherRepository, "useVoucher").mockResolvedValueOnce({ ...fakeVoucher, used: true });

    const fakeAmount = 100;

    const fakeFinalAmount = fakeAmount - (fakeAmount * ((fakeVoucher.discount) / 100));

    const result = await voucherService.applyVoucher(fakeVoucher.code, fakeAmount);

    expect(result.amount).toBe(fakeAmount);
    expect(result.discount).toBe(fakeVoucher.discount);
    expect(result.finalAmount).toBe(fakeFinalAmount);
    expect(result.applied).toBe(true);
  });

  it("should not to be able to apply an noncreated voucher", async () => {

    const fakeVoucher = {
      id: 1,
      code: "a1b2c3d4",
      discount: 10,
      used: true
    };

    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockResolvedValueOnce(fakeVoucher);

    expect(
      voucherService.createVoucher(fakeVoucher.code, fakeVoucher.discount)
    ).rejects.toEqual(conflictError("Voucher already exist."));

  });
});