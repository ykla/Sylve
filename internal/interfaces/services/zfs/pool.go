// SPDX-License-Identifier: BSD-2-Clause
//
// Copyright (c) 2025 The FreeBSD Foundation.
//
// This software was developed by Hayzam Sherif <hayzam@alchemilla.io>
// of Alchemilla Ventures Pvt. Ltd. <hello@alchemilla.io>,
// under sponsorship from the FreeBSD Foundation.

package zfsServiceInterfaces

type Vdev struct {
	Name        string   `json:"name"`
	VdevDevices []string `json:"devices"`
}

type Zpool struct {
	Name        string            `json:"name" binding:"required,alphanum,min=1,max=24"`
	RaidType    string            `json:"raidType" binding:"omitempty,oneof= mirror raidz raidz2 raidz3"`
	Vdevs       []Vdev            `json:"vdevs"`
	Properties  map[string]string `json:"properties"`
	CreateForce bool              `json:"createForce"`
	Spares      []string          `json:"spares"`
}

type ReplaceDevice struct {
	Old string `json:"old" binding:"required,min=1,max=24"`
	New string `json:"new" binding:"required,min=1,max=24"`
}

type PoolStatPoint struct {
	Time       int64   `json:"time"`
	Allocated  uint64  `json:"allocated"`
	Free       uint64  `json:"free"`
	Size       uint64  `json:"size"`
	DedupRatio float64 `json:"dedupRatio"`
}
