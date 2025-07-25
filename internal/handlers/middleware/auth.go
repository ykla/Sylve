// SPDX-License-Identifier: BSD-2-Clause
//
// Copyright (c) 2025 The FreeBSD Foundation.
//
// This software was developed by Hayzam Sherif <hayzam@alchemilla.io>
// of Alchemilla Ventures Pvt. Ltd. <hello@alchemilla.io>,
// under sponsorship from the FreeBSD Foundation.

package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	authService "sylve/internal/services/auth"
	"sylve/pkg/utils"
)

func EnsureAuthenticated(authService *authService.Service) gin.HandlerFunc {
	return func(c *gin.Context) {
		path := c.Request.URL.Path

		if strings.HasPrefix(path, "/api/utilities/downloads/") &&
			len(path) > len("/api/utilities/downloads/") {
			return
		}

		if path == "/api/auth/login" {
			return
		}

		var token string
		var err error

		if hash := c.Query("hash"); hash != "" {
			token, err = authService.GetTokenBySHA256(hash)
			if err != nil {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"status": "error", "error": "invalid_hash"})
				return
			}
		}

		if token == "" {
			token, err = utils.GetTokenFromHeader(c.Request.Header)
			if err != nil {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "no_token_provided"})
				return
			}
		}

		_, err = authService.ValidateToken(token)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"status": "error", "error": err.Error()})
			return
		}

		c.Set("Token", token)
		c.Next()
	}
}
