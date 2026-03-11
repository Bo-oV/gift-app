# PROJECT_STATUS — Gift Planner MVP

## Project Overview

Веб-додаток для створення списку подарунків для події (наприклад день народження), де гості можуть резервувати подарунки.

Головна ідея:

* Власник створює подію
* Додає подарунки
* Ділиться посиланням
* Інші користувачі резервують подарунки
* Власник **не бачить хто зарезервував**

---

# Tech Stack

Frontend

* React
* Vite
* TypeScript
* React Router

Backend

* Firebase
* Firebase Auth (Google Login)
* Firestore Database

Libraries

* react-hot-toast

---

# Firestore Structure

```
events
   eventId
      title
      date
      ownerId
      createdAt

      gifts
         giftId
            title
            description
            imageUrl
            reserved
            reservedBy
            eventTitle
            createdAt

reservations
   reservationId
      giftId
      eventId
      reservedBy
      createdAt

users
   userId
      name
      email
```

---

# Implemented Features

## Authentication

* Google OAuth login
* AuthContext
* Protected routes

## Events

User can:

* create event
* edit event
* view event page

Event page shows:

* title
* date
* gifts list
* copy event link

Only owner can:

* edit event
* add gifts
* delete gifts

---

## Gifts

Owner can:

* add gift
* delete gift

Guests can:

* reserve gift
* cancel reservation

Logic:

```
gift.reserved === false
→ show "Reserve"

gift.reservedBy === currentUser
→ show "Cancel Reservation"

gift.reserved === true AND reservedBy !== user
→ show disabled "Reserved"
```

Realtime updates через Firestore `onSnapshot`.

---

# Reservation System

Reserve gift через Firestore transaction:

```
runTransaction
   check gift.reserved
   update gift
   create reservation document
```

Cancel reservation:

```
update gift
   reserved = false
   reservedBy = null
```

---

# Pages

Login
Home
CreateEvent
EditEvent
EventPage
MyReservations
Profile

---

# Components

EventCard
GiftCard
AddGiftModal
BottomNavigation
Layout

---

# Project Structure

```
src

components
   EventCard
   GiftCard
   AddGiftModal
   BottomNavigation

pages
   Home
   Login
   EventPage
   CreateEvent
   EditEvent
   MyReservations
   Profile

services
   eventService
   giftService
   reservationService

types
   event
   gift
   reservation

context
   AuthProvider
   useAuth

firebase
   firestore
   auth
```

---

# Important Logic

GiftCard receives props:

```
gift
eventId
eventTitle
ownerId
```

Cancel reservation:

```
cancelReservation(eventId, giftId)
```

Reserve gift:

```
transaction.update(gift)
transaction.set(reservation)
```

Realtime gifts:

```
subscribeToGifts(eventId, setGifts)
```

---

# Current Status

Working features:

✓ Auth (Google login)
✓ Protected routes
✓ Create event
✓ Edit event
✓ Add gifts
✓ Delete gifts
✓ Reserve gift
✓ Cancel reservation
✓ MyReservations page
✓ Copy event link
✓ Realtime updates (Firestore onSnapshot)
✓ Services layer
✓ Types layer

MVP status: **≈ 98% complete**

---

# Next Development Steps

Planned improvements:

### UI / UX

* mobile layout container
* better gift card design
* loading states
* skeleton loaders

### Features

* event cover image
* gift link (Amazon / store link)
* mark gift as purchased
* owner dashboard

### Architecture

* Firestore constants
* React Query integration
* better Firestore security rules

---

# Current Problem Solved Recently

Cancel reservation bug fixed.

Cause:

```
cancelReservation(gift.eventId, gift.id)
```

Solution:

```
cancelReservation(eventId, gift.id)
```

because gift document does not contain eventId.

---

# Goal

Finish MVP → polish UI → publish demo version.
