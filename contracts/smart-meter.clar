;; Smart Meter Integration Contract

(define-map smart-meters
  { meter-id: (string-ascii 20) }
  {
    owner: principal,
    energy-produced: uint,
    energy-consumed: uint
  }
)

(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u300))
(define-constant err-unauthorized (err u301))

(define-public (register-smart-meter (meter-id (string-ascii 20)))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (map-set smart-meters
      { meter-id: meter-id }
      {
        owner: tx-sender,
        energy-produced: u0,
        energy-consumed: u0
      }
    ))
  )
)

(define-public (update-meter-reading (meter-id (string-ascii 20)) (energy-produced uint) (energy-consumed uint))
  (let
    (
      (meter (unwrap! (map-get? smart-meters { meter-id: meter-id }) err-unauthorized))
      (net-energy (if (> energy-produced energy-consumed)
                    (- energy-produced energy-consumed)
                    (- energy-consumed energy-produced)))
    )
    (asserts! (is-eq tx-sender (get owner meter)) err-unauthorized)
    (ok (map-set smart-meters
      { meter-id: meter-id }
      {
        owner: (get owner meter),
        energy-produced: energy-produced,
        energy-consumed: energy-consumed
      }
    ))
  )
)

(define-read-only (get-meter-reading (meter-id (string-ascii 20)))
  (ok (unwrap! (map-get? smart-meters { meter-id: meter-id }) (err u404)))
)

