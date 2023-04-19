from faker import Faker
from random import choice, randint
from categories import categories

fake = Faker()


res = [
    {"owner": 1,
    "name":fake.sentence(nb_words=1),
                    "about":fake.sentence(nb_words=20),
                    "main_pic": fake.image(size=(32, 32), image_format="png"),
                    "background_pic": fake.image(size=(1000, 200), image_format="png"),
                    "category":  randint(1, len(categories.keys()))
                    }
                    for i in range(1)]

print(res[0]['main_pic'])