;; Energy Marketplace Contract

(define-map energy-offers
  { offer-id: uint }
  {
    seller: principal,
    amount: uint,
    price-per-unit: uint,
    expiration: uint
  }
)

(define-data-var next-offer-id uint u0)

(define-constant err-invalid-offer (err u200))
(define-constant err-expired-offer (err u201))
(define-constant err-insufficient-funds (err u202))

(define-public (create-offer (amount uint) (price-per-unit uint) (expiration uint))
  (let
    (
      (offer-id (var-get next-offer-id))
    )
    (map-set energy-offers
      { offer-id: offer-id }
      {
        seller: tx-sender,
        amount: amount,
        price-per-unit: price-per-unit,
        expiration: expiration
      }
    )
    (var-set next-offer-id (+ offer-id u1))
    (ok offer-id)
  )
)

(define-public (accept-offer (offer-id uint))
  (let
    (
      (offer (unwrap! (map-get? energy-offers { offer-id: offer-id }) err-invalid-offer))
      (total-price (* (get amount offer) (get price-per-unit offer)))
    )
    (asserts! (< block-height (get expiration offer)) err-expired-offer)
    (try! (stx-transfer? total-price tx-sender (get seller offer)))
    (map-delete energy-offers { offer-id: offer-id })
    (ok true)
  )
)

(define-read-only (get-offer (offer-id uint))
  (ok (unwrap! (map-get? energy-offers { offer-id: offer-id }) err-invalid-offer))
)

