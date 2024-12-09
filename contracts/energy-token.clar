;; Energy Token Contract

(define-fungible-token energy-token)

(define-constant contract-owner tx-sender)

(define-constant err-owner-only (err u100))
(define-constant err-insufficient-balance (err u101))

(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ft-mint? energy-token amount recipient)
  )
)

(define-public (transfer (amount uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) err-owner-only)
    (ft-transfer? energy-token amount sender recipient)
  )
)

(define-read-only (get-balance (account principal))
  (ok (ft-get-balance energy-token account))
)

(define-public (burn (amount uint) (account principal))
  (begin
    (asserts! (is-eq tx-sender account) err-owner-only)
    (ft-burn? energy-token amount account)
  )
)

