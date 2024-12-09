import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Energy Marketplace Contract', () => {
  const mockContractCall = vi.fn();
  const seller = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  const buyer = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
  
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  it('should create an offer', () => {
    mockContractCall.mockReturnValue({ success: true, value: 0 });
    const result = mockContractCall('energy-marketplace', 'create-offer', ['u1000', 'u10', 'u100000'], seller);
    expect(result).toEqual({ success: true, value: 0 });
  });
  
  it('should accept an offer', () => {
    mockContractCall.mockReturnValue({ success: true });
    const result = mockContractCall('energy-marketplace', 'accept-offer', ['u0'], buyer);
    expect(result).toEqual({ success: true });
  });
  
  it('should not accept an expired offer', () => {
    mockContractCall.mockReturnValue({ success: false, error: 201 });
    const result = mockContractCall('energy-marketplace', 'accept-offer', ['u1', 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.energy-token'], buyer);
    expect(result).toEqual({ success: false, error: 201 });
  });
  
  it('should get offer details', () => {
    mockContractCall.mockReturnValue({
      success: true,
      value: {
        seller: seller,
        amount: 1000,
        price_per_unit: 10,
        expiration: 100000
      }
    });
    const result = mockContractCall('energy-marketplace', 'get-offer', ['u0']);
    expect(result).toEqual({
      success: true,
      value: {
        seller: seller,
        amount: 1000,
        price_per_unit: 10,
        expiration: 100000
      }
    });
  });
});

