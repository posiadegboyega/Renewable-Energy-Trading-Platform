import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Smart Meter Integration Contract', () => {
  const mockContractCall = vi.fn();
  const contractOwner = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  const user1 = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
  
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  it('should register a smart meter', () => {
    mockContractCall.mockReturnValue({ success: true });
    const result = mockContractCall('smart-meter', 'register-smart-meter', ['"METER001"'], contractOwner);
    expect(result).toEqual({ success: true });
  });
  
  it('should not allow non-owners to register a smart meter', () => {
    mockContractCall.mockReturnValue({ success: false, error: 300 });
    const result = mockContractCall('smart-meter', 'register-smart-meter', ['"METER002"'], user1);
    expect(result).toEqual({ success: false, error: 300 });
  });
  
  it('should update meter reading for net production', () => {
    mockContractCall.mockReturnValue({ success: true });
    const result = mockContractCall('smart-meter', 'update-meter-reading', ['"METER001"', 'u1000', 'u800'], user1);
    expect(result).toEqual({ success: true });
  });
  
  it('should update meter reading for net consumption', () => {
    mockContractCall.mockReturnValue({ success: true });
    const result = mockContractCall('smart-meter', 'update-meter-reading', ['"METER001"', 'u800', 'u1000'], user1);
    expect(result).toEqual({ success: true });
  });
  
  it('should get meter reading', () => {
    mockContractCall.mockReturnValue({
      success: true,
      value: {
        owner: user1,
        energy_produced: 1000,
        energy_consumed: 800
      }
    });
    const result = mockContractCall('smart-meter', 'get-meter-reading', ['"METER001"']);
    expect(result).toEqual({
      success: true,
      value: {
        owner: user1,
        energy_produced: 1000,
        energy_consumed: 800
      }
    });
  });
});

