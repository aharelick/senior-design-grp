import urllib3
import bs4
#contents = urllib3.urlopen("http://api.penncoursereview.com/v1/coursehistories/CIS-120?token=public").read()
#print contents
http = urllib3.PoolManager()
r = http.request('GET', 'http://api.penncoursereview.com/v1/coursehistories/CIS-120?token=public')
soup = BeautifulSoup(r.read());
print soup
