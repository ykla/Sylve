import { APIResponseSchema, type APIResponse } from '$lib/types/common';
import { apiRequest } from '$lib/utils/http';

export async function modifyHardware(
	vmId: number,
	cpuSockets: number,
	cpuCores: number,
	cpuThreads: number,
	ram: number,
	cpuPinning: number[],
	vncPort: number,
	vncResolution: string,
	vncPassword: string,
	vncWait: boolean
): Promise<APIResponse> {
	return await apiRequest(`/vm/hardware/${vmId}`, APIResponseSchema, 'PUT', {
		cpuSockets,
		cpuCores,
		cpuThreads,
		ram,
		cpuPinning,
		vncPort,
		vncResolution,
		vncPassword,
		vncWait
	});
}
