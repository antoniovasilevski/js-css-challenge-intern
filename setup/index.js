function manageLikeCount(btn) {
	// toggle active on pressed btn, get next sibling elemennt and inc count
	btn.classList.toggle("active-like-btn")
	let counter = parseInt(btn.nextElementSibling.textContent)
	if (btn.classList.contains("active-like-btn")) counter++
	else counter--
	btn.nextElementSibling.textContent = counter
}

function formatDate(dateString) {

	// format date as "dd MMM yyy"
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	]
	const date = new Date(dateString)
	const day = date.getDate()
	const month = date.getMonth()
	const year = date.getFullYear()
	const formatter = `${day} ${months[month]} ${year}`

	return formatter
}

function createCards(cards) {
	// create html tree fragment
	const fragment = document.createDocumentFragment()

	for (let cardObj of cards) {
    // get card data for each object and create new element for each
    const card = document.createElement("div")
    card.className = `card hidden all ${cardObj.source_type}`

    const profile = document.createElement("div")
    profile.className = "profile"

    const profileImg = document.createElement("img")
    profileImg.className = "profile-img"
    profileImg.src = cardObj.profile_image
    profileImg.alt = ""

    const profileInfo = document.createElement("div")
    profileInfo.className = "profile-info"

    const profileName = document.createElement("p")
    profileName.className = "name"
    profileName.textContent = cardObj.name

    const date = document.createElement("p")
    date.className = "date"
    date.textContent = formatDate(cardObj.date)

    const socialLink = document.createElement("a")
    socialLink.href = cardObj.source_link

    const socialIcon = document.createElement("img")
    socialIcon.alt = `${cardObj.source_type}`

    // set icon per source type, assumes source type is correct
    if (cardObj.source_type === "instagram") {
      socialIcon.src = "../icons/instagram-logo.svg"
    } else if (cardObj.source_type === "facebook") {
      socialIcon.src = "../icons/facebook.svg"
    } else if (cardObj.source_type === "twitter") {
      socialIcon.src = ""
    }
    socialIcon.className = "social-icon"

    // append each elem to its parent
    socialLink.appendChild(socialIcon)
    profileInfo.appendChild(profileName)
    profileInfo.appendChild(date)
    profile.appendChild(profileImg)
    profile.appendChild(profileInfo)
    profile.appendChild(socialLink)

    const cardImgContainer = document.createElement("div")
    cardImgContainer.className = "card-img-container"
    cardImgContainer.style.backgroundImage = `url(${cardObj.image})`

    const text = document.createElement("p")
    text.className = "card-text"
    text.textContent = cardObj.caption

    const likes = document.createElement("div")
    likes.className = "likes"

    const likeBtn = document.createElement("img")
    likeBtn.className = "like-btn"

    // add event listener to like btn, calls function to inc/dec count
    likeBtn.addEventListener("click", () => {
      manageLikeCount(likeBtn)
    })
    likeBtn.src = "../icons/heart.svg"
    likeBtn.alt = ""

    const likeCount = document.createElement("h6")
    likeCount.className = "like-count"
    likeCount.textContent = cardObj.likes

    // append each elem to its parent
    likes.appendChild(likeBtn)
    likes.appendChild(likeCount)

    // append each elem to its card
    card.appendChild(profile)
    card.appendChild(cardImgContainer)
    card.appendChild(text)
    card.appendChild(likes)

    // append card to its tree fragment
    fragment.appendChild(card)
  }

	return fragment
}

function changeLayout(value) {
  const container = document.querySelector(".card-container")
  const cards = document.querySelectorAll(".card")

  // check if selected value is number, if so set layout accordingly
  // it doesnt look good with many cards and low window width, hence width checks
  // still not working properly if window is resized after picking 4/5 columns
  if (!isNaN(value)) {
    const getNumber = parseInt(value)
    cards.forEach((card) => {
      if (getNumber === 1) {
        card.style = `flex-basis: calc(90% / ${getNumber});`
        container.style = `max-width: 800px`
      } else if (getNumber === 2) {
        card.style = `flex-basis: calc(90% / ${getNumber})`
        container.style = `max-width: 1400px`
      } else if (getNumber === 3 && window.innerWidth > 1200) {
        card.style = `flex-basis: calc(90% / ${getNumber})`
        container.style = `max-width: none`
      } else if (getNumber === 4 && window.innerWidth > 1300) {
        card.style = `flex-basis: calc(90% / ${getNumber})`
        container.style = `max-width: none`
      } else if (getNumber === 5 && window.innerWidth > 1500) {
        card.style = `flex-basis: calc(90% / ${getNumber})`
        container.style = `max-width: none`
      }
    })
  } else {

	// set default if dynamic
    cards.forEach((card) => {
      card.style = `flex-basis: calc(90% / 2)`
      container.style = `max-width: 1400px`
    })
  }
}

function changeColor(colorValue) {

	// check if entered value is a valid hexadecimal color
	const reg = /^#([0-9A-F]{3}){1,2}$/i
	if (reg.test(colorValue)) {
		const cards = document.querySelectorAll(".card")
		for (let card of cards) {
			card.style.background = `${colorValue}`
		}
	}
}

function changeGap(gapValue) {

	// gap value works up to a point, then it goes to a single column
	const container = document.querySelector(".card-container")
	container.style.gap = `${gapValue}`
}

function changeTheme() {
	const cards = document.querySelectorAll(".card")
	cards.forEach((card) => {
		card.classList.toggle("darkTheme")
	})
	document.querySelector(".preview").classList.toggle("darkContainer")
}

function filterCards(source) {

	// check for source type as a class, show cards accordingly
	const cards = document.querySelectorAll(".card")
	cards.forEach((card) => {
		if (!card.classList.contains(source)) {
			card.classList.add("filter")
		} else card.classList.remove("filter")
	})
}

function showCards() {

	// get all hidden cards
	const hiddenCards = document.querySelectorAll(".hidden")
	let counter = 1

	// show 4 cards each time the function is called
	hiddenCards.forEach((card) => {
		if (counter <= 4) {
			if (card.classList.contains("hidden")) {
				card.classList.remove("hidden")
				counter++
			}
		}
	})
	// if no hidden cards left, hide load more btn
	if (document.querySelectorAll(".hidden").length === 0) {
		document.getElementById("load-btn").style.display = "none"
	}
}

function getData() {
	
	// fetch data from local json 
	fetch("../data.json")
		.then((response) => response.json())
		.then((cards) => {
			const cardContainer = document.querySelector(".card-container")

			// create cards and append fragment to html tree
			const cardFragment = createCards(cards)
			cardContainer.appendChild(cardFragment)
		})
		.catch((error) => console.error(error))
}

getData()

// show 4 cards on load
window.onload = () => {
	showCards()
}

// resize event listener, disables column number field when < 992px
window.addEventListener("resize", () => {
	if (window.innerWidth < 992) {
		document.getElementById("numberOfColumns").disabled = true
	} else {
		document.getElementById("numberOfColumns").disabled = false
	}
})

document
	.getElementById("numberOfColumns")
	.addEventListener("change", (event) => {
		changeLayout(event.target.value)
	})

document.getElementById("load-btn").addEventListener("click", () => {
	showCards()
})

document
	.getElementById("cardBackgroundColor")
	.addEventListener("keyup", (event) => {
		changeColor(event.target.value)
	})

document
	.getElementById("cardSpaceBetween")
	.addEventListener("keyup", (event) => {
		changeGap(event.target.value)
	})

document.querySelectorAll(".theme").forEach((elem) => {
	elem.addEventListener("change", () => {
		changeTheme()
	})
})

document.querySelectorAll(".source").forEach((elem) => {
	elem.addEventListener("change", (event) => {
		filterCards(event.target.value)
	})
})
