import { APIResponseSchema, type APIResponse } from '$lib/types/common';
import {
	VMDomainSchema,
	VMSchema,
	VMStatSchema,
	type CreateData,
	type VM,
	type VMDomain,
	type VMStat
} from '$lib/types/vm/vm';
import { apiRequest } from '$lib/utils/http';
import { z } from 'zod/v4';

export async function getVMs(): Promise<VM[]> {
	return await apiRequest('/vm', z.array(VMSchema), 'GET');
}

export async function newVM(data: CreateData): Promise<APIResponse> {
	return await apiRequest('/vm', APIResponseSchema, 'POST', {
		name: data.name,
		vmId: parseInt(data.id.toString(), 10),
		iso: data.storage.iso,
		storageType: data.storage.type,
		storageDataset: data.storage.guid,
		storageSize: data.storage.size,
		storageEmulationType: data.storage.emulation,
		switchId: data.network.switch,
		switchEmulationType: data.network.emulation,
		macAddress: data.network.mac,
		cpuSockets: parseInt(data.hardware.sockets.toString(), 10),
		cpuCores: parseInt(data.hardware.cores.toString(), 10),
		cpuThreads: parseInt(data.hardware.threads.toString(), 10),
		ram: parseInt(data.hardware.memory.toString(), 10),
		cpuPinning: data.hardware.pinnedCPUs,
		vncPort: data.advanced.vncPort,
		vncPassword: data.advanced.vncPassword,
		vncWait: data.advanced.vncWait,
		vncResolution: data.advanced.vncResolution,
		startAtBoot: data.advanced.startAtBoot,
		tpmEmulation: data.advanced.tpmEmulation,
		bootOrder: parseInt(data.advanced.bootOrder.toString(), 10),
		pciDevices: data.hardware.passthroughIds,
		description: data.description
	});
}

export async function deleteVM(id: number): Promise<APIResponse> {
	return await apiRequest(`/vm/${id}`, APIResponseSchema, 'DELETE');
}

export async function getVMDomain(id: number | string): Promise<VMDomain> {
	return await apiRequest(`/vm/domain/${id}`, VMDomainSchema, 'GET');
}

export async function actionVm(id: number | string, action: string): Promise<APIResponse> {
	return await apiRequest(`/vm/${id}/${action}`, APIResponseSchema, 'POST');
}

export async function getStats(vmId: number, limit: number): Promise<VMStat[]> {
	return await apiRequest(`/vm/stats/${vmId}/${limit}`, z.array(VMStatSchema), 'GET');
}

export async function updateDescription(id: number, description: string): Promise<APIResponse> {
	return await apiRequest(`/vm/description`, APIResponseSchema, 'PUT', {
		id,
		description
	});
}
