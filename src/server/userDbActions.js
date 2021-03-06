import { db, storageRef } from "../fbconfig";
import { songService } from "./songDbActions";

function dataFetcher() {
  this.getCollectionById = (collectionName, id, userPercent) => {
    return new Promise((resolve, reject) => {
      let ref = db.collection(collectionName).doc(id);
      ref
        .get()
        .then(res => {
          res = res.data();
          res.id = id;
          res['ownerDetails'] = userPercent
          resolve(res);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
}
// - Import react components

export const userService = {
  getSellers: (ids) => {
    console.log("GETSELLERNAMES", ids)
    return new Promise((resolve, reject)=> {
      let userMap = []
      let promises = Object.keys(ids).map((id) => {
        return new Promise((resolve, reject) => {
          let userRef = db.doc(`users/${id}`)
          userRef.get().then((doc) => {
            let user = doc.data()
            resolve(user)
          })
        })
      })
        Promise.all(promises).then((values) => {
          let sellers = values.reduce((res, user)=> {
             res[user.userId]= user
             return res
          }, {})
          
          resolve({sellers: sellers})
        })
        .catch(error => {
          reject(error)
        })
  
  
    

    })

  },
  /**
   * Get user information for profile
   *
   */
  dbGetUserInfo: userId => {
    return new Promise((resolve, reject) => {
      let ref = db.collection("users").doc(userId);
      let fetcher = new dataFetcher();
      let songs = [];
      ref
        .get()
        .then(user => {
          let userInfo = user.data();
          userInfo.songs = [];
          let promises = Object.keys(userInfo.songsOwned).map((id) =>{
            
            const percent = userInfo.songsOwned[id].percentOwned
            console.log("PERCENT", percent)
            let d = {}
            d[userId] = percent
            return fetcher.getCollectionById("songs", id, d)
          });
          console.log(promises)
          Promise.all(promises).then(values => {
            userInfo.songs = values;
            console.log('userINFO', userInfo)
            resolve({ user: userInfo });
          });
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  updateProfile: (uid, profile) => {
    return new Promise((resolve, reject) => {
      // const batch = db.batch()
      let profileRef = db.doc(`users/${uid}`);
      profileRef
        .update(profile)
        .then(() => {
          resolve(profile);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  updatedprofileWithImage: (uid, profile, image, imageName) => {
    return new Promise((resolve, reject) => {
      let profileData = {};
      let profileRef = db.doc(`users/${uid}`);

      //find the existing profile picture saved in storage
      profileRef.get().then(profileDoc => {
        const existingImagePath = profileDoc.data().imageFullPath;
        //if there is an existing image saved store is as a reference
        const existingImageRef = existingImagePath
          ? storageRef.child(existingImagePath)
          : null;

        //save the new chosen profile picture into storage

        const imageKey = Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, "")
          .substr(0, 9);
        const imageStorageFile = storageRef.child(
          `images/${imageKey}_${imageName}`
        );

        imageStorageFile
          .put(image)
          .then(imageResult => {
            imageResult.ref.getDownloadURL().then(imageDownloadURL => {
              profileData = {
                ...profile,
                photoUrl: imageDownloadURL,
                imageFullPath: imageResult.metadata.fullPath
              };

              profileRef.update(profileData).then(savedProfile => {
                //resolve with the savedProfile Image

                //delete the old profile image if there is onw
                  if (existingImageRef) {
                      existingImageRef
                          .delete()
                          .then(message => {
                              resolve(profileData);
                          })
                          .catch(message => {
                              resolve(profileData);
                          });
                  }
                resolve(profileData);
              });
            });

            //update the user information in the database
          })
          .catch(error => {
            reject(error);
          });
      });
    });
  },

  /**
   * deletes image in firebase storage
   * @param imagePath the path of image in firebase storage to delete
   * @returns {Promise<any>}
   */
  deleteImage: imagePath => {
    return new Promise((resolve, reject) => {
      if (imagePath) {
        const imageRef = storageRef.child(imagePath);

        //delete the image
        imageRef
          .delete()
          .then(() => {
            resolve("Image deleted successfully");
          })
          .catch(error => {
            reject(error);
          });
      } else {
        reject("Image path no specified");
      }
    });
  },

  /**
   * Saves an image to the firebase storage
   * @param image the image itself that will be saved in the storage
   * @param imageName type String: name of image
   * @returns {Promise<any>}
   */
  saveImage: (image, imageName) => {
    return new Promise((resolve, reject) => {
      let imageInfo = {};
      const imageKey = Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, "")
        .substr(0, 9);
      const imageStorageFile = storageRef.child(
        `images/${imageKey}_${imageName}`
      );

      imageStorageFile.put(image).then(imageResult => {
        console.log("succesfully saved image");
        imageResult.ref
          .getDownloadURL()
          .then(imageDownloadURL => {
            imageInfo = {
              imageDownloadURL: imageDownloadURL,
              imageResult: imageResult
            };
            resolve(imageInfo);
          })
          .catch(error => {
            console.log("error saving image");
            reject(error);
          });
      });
    });
  }
};
