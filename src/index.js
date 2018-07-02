import fetch from 'isomorphic-fetch'
import titleize from 'titleize'

function findWebhooks() {
	console.log(`Pulling webhooks from environment variables...`)
	const webhooks = {}
	const regUnderscore = /_/g
	let total = 0
	for (let i in process.env) {
		const env = process.env[i]
		if (i.indexOf(`WEBHOOK_`) === 0) {
			let key = i.replace(`WEBHOOK_`, ``)
				.replace(regUnderscore, ' ')
			key = titleize(key)
			webhooks[key] = env
			total++
		}
	}
	if(!total){
		console.error(`No webhooks found`)
		process.exit(0)
	}
	console.log(`Found ${total} webhooks...`)
	return webhooks
}

async function triggerWebhooks(webhooks){
	console.log(`Triggering webhooks...`)
	const promises = []
	for(let name in webhooks){
		const url = webhooks[name]
		promises.push(
			fetch(url, { method: `post` })
				.then(() => console.log(`Started build for ${name}...`))
				.catch(err => { throw err })
		)
	}
	try{
		await Promise.all(promises)
	}
	catch(err){
		console.error(err)
		process.exit(1)
	}
	console.log(`Done!`)
}

const webhooks = findWebhooks()
triggerWebhooks(webhooks)