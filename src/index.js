import fetch from 'isomorphic-fetch'

function findWebhooks() {
	console.log(`Pulling webhooks from environment variables...`)
	const webhooks = {}
	const regUnderscore = /_/g
	for (let i in process.env) {
		const env = process.env[i]
		if (env.indexOf(`WEBHOOK_`) === 0) {
			const key = env.replace(`WEBHOOK_`)
				.replace(regUnderscore, ' ')
			webhooks[key] = env
		}
	}
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