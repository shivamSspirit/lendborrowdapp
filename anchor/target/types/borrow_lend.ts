/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/borrow_lend.json`.
 */
export type BorrowLend = {
  "address": "FqfKDfzgDaf4JsEaP5eDX9qEedUPdfdv8uCcQDv4LszL",
  "metadata": {
    "name": "borrowLend",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "borrowMain",
      "discriminator": [
        188,
        75,
        240,
        167,
        15,
        93,
        41,
        4
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "user",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  85,
                  83,
                  69,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "lend",
          "type": {
            "defined": {
              "name": "borrowedToken"
            }
          }
        }
      ]
    },
    {
      "name": "initUserMain",
      "discriminator": [
        21,
        240,
        62,
        193,
        88,
        240,
        166,
        161
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "user",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  85,
                  83,
                  69,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "lendMain",
      "discriminator": [
        146,
        221,
        18,
        12,
        64,
        28,
        144,
        163
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "user",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  85,
                  83,
                  69,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "lend",
          "type": {
            "defined": {
              "name": "lendedToken"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "userAcc",
      "discriminator": [
        171,
        109,
        66,
        173,
        40,
        74,
        3,
        138
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "borrowHigherThanLend",
      "msg": "Borrow amount Higher than Lend Amount"
    }
  ],
  "types": [
    {
      "name": "borrowedToken",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "lendedToken",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "userAcc",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "lendedTokens",
            "type": {
              "vec": {
                "defined": {
                  "name": "lendedToken"
                }
              }
            }
          },
          {
            "name": "borrowedTokens",
            "type": {
              "vec": {
                "defined": {
                  "name": "borrowedToken"
                }
              }
            }
          }
        ]
      }
    }
  ]
};
