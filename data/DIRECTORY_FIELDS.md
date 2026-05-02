# Baja411 Local Directory Intake Fields

This reference explains each field used in `baja411/data/directory-intake-template.csv`.

## Field reference

| Field | Meaning |
|---|---|
| `name` | Public listing title for the directory resource. |
| `resource_type` | High-level resource type classification. |
| `category` | Practical category users search for (example: Water delivery, Mechanics, Clinics). |
| `town` | Primary town where the listing is located or based. |
| `area` | Area, colonia, or neighborhood within the town. |
| `address` | Street address if known. |
| `location_notes` | Landmark or wayfinding notes to help users find the location. |
| `latitude` | Latitude coordinate in decimal format when known. |
| `longitude` | Longitude coordinate in decimal format when known. |
| `phone` | Primary call number for the listing. |
| `whatsapp` | WhatsApp contact number (can be same as phone). |
| `website` | Official website URL if available. |
| `facebook` | Public Facebook page or social profile URL intended for business/service contact. |
| `hours` | Known opening/service hours. |
| `tags` | Comma-friendly keywords to improve matching and filtering. |
| `description` | Short practical summary of what the listing provides. |
| `emergency_useful` | `true` or `false` for emergency usefulness context. |
| `english_spoken` | Known or unknown English support status. |
| `payment_notes` | Known payment notes, including cash/card context when available. |
| `delivery_available` | `true` or `false` if delivery applies. |
| `service_area` | Area covered when service is mobile or multi-town. |
| `verified` | `true` or `false` indicating verification status. |
| `last_verified` | Date of latest verification when available (`YYYY-MM-DD`). |
| `verified_by` | Initials/name/team marker for who verified. |
| `source_notes` | Intake source note and context. |
| `map_pin_status` | Mapping status note (example: `not_mapped`, `mapped`, `needs_review`). |

## Accepted `resource_type` values

- business
- government_office
- public_service
- emergency_resource
- utility_provider
- roadside_help
- marine_service
- medical_resource
- home_service
- shopping_supply
- food_drink
- activity_entertainment
- professional_service
- other

## Accepted town suggestions

- Cerritos
- El Pescadero
- Todos Santos
- La Paz
- Cabo San Lucas
- San José del Cabo
- Loreto
- Los Barriles
- La Ventana
- El Sargento
- Santiago
- Miraflores
- Other

## Accepted category suggestions

- Fuel
- Water delivery
- Propane delivery
- SAPA / water office
- Mexican driver’s license
- Centro de Salud services
- AC repair
- Tow trucks
- Ángeles Verdes / Green Angels roadside help
- Papelerías
- Package receiving
- Breakfast
- Lunch
- Dinner
- Boat services
- Free boat launch locations
- Marine mechanics
- Tire shops
- Mechanics
- Home services
- Electricians
- Plumbers
- Painting
- Roof sealing
- Local shops
- Clothes
- Pool supplies
- Pet supplies
- Medical supplies
- Medical equipment rentals
- Hospitals
- Clinics
- Government health programs
- Chest X-ray
- Labs
- Ultrasound
- MRI
- Dentists
- Vets
- Karaoke
- Dance places
- Dance classes
- Rentals
- Tours & Activities
- Emergency
- Professional Services

## Required implementation note

The current live app uses `/businesses` and the current Prisma `BusinessCategory` enum does not yet contain every human facing category or resource type. Do not change schema in this task. This intake system is for collecting data first. Schema and category mapping can be expanded later in a focused migration task.
