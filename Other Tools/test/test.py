import json
import requests
from requests.compat import urljoin

## Replace eScriptorium_Token with your toke if you want to test this! 
headers = {'Content-type':'application/json', 'Accept':'application/json', 'Authorization':'Token eScriptorium_Token'}
doc_nu = "79"
root_url = 'https://serv50.ub.uni-heidelberg.de/api/documents'
part_list = []

res = requests.get(root_url, headers=headers)
try:
    data = res.json()
    print(data)
except json.decoder.JSONDecodeError as e:
    print(res)
else:
    print(res)

def loop_through_document(doc_nu):
    part_url = urljoin(root_url, '/api/documents/%d/parts/' % int(doc_nu))

    def get_page(page):
        url = urljoin(part_url, '?page=%d' % page)
        print('fetching', url)
        res = requests.get(url, headers=headers)
        try:
            data = res.json()
        except json.decoder.JSONDecodeError as e:
            print(res)
        else:
            print(res)
    get_page(1)
    return(part_list)

## part_list = loop_through_document(doc_nu)
print('done')
