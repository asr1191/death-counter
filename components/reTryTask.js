export default function reTryTask(maxRetries, task) {
    count = 1
    while (true) {
        try {
            if (count == 0) {
                task()
            }
            console.log('RETRY-TASK: Success!');
            break;
        } catch (e) {
            console.error(e);
            console.log('RETRY-TASK: Exception. Retrying %d of %d attempts.', count + 1, maxRetries);
            count += 1
            if (count == maxRetries) {
                throw e
            }
        }
    }
}